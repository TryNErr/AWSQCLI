import boto3
import json
import glob
import os
import time
from datetime import datetime

# Initialize clients
bedrock = boto3.client('bedrock', region_name='us-east-1')
s3 = boto3.client('s3', region_name='us-east-1')

# Configuration
BUCKET_NAME = 'your-bedrock-batch-bucket'  # Replace with your bucket
MODEL_ID = 'openai.gpt-oss-20b-1:0'

def create_bucket_if_not_exists():
    """Create S3 bucket if it doesn't exist"""
    try:
        s3.head_bucket(Bucket=BUCKET_NAME)
    except:
        s3.create_bucket(Bucket=BUCKET_NAME)
        print(f"Created bucket: {BUCKET_NAME}")

def prepare_batch_input():
    """Convert prompt files to JSONL format"""
    os.makedirs('prompt/output', exist_ok=True)
    
    batch_data = []
    prompt_files = glob.glob('prompt/*.txt')
    
    for i, prompt_file in enumerate(prompt_files):
        with open(prompt_file, 'r') as f:
            content = f.read()
        
        record = {
            "recordId": f"record_{i}_{os.path.basename(prompt_file)}",
            "modelInput": {
                "messages": [
                    {"role": "system", "content": "You must respond with valid JSON format only. Ensure all output is properly formatted JSON and encoded in UTF-8."},
                    {"role": "user", "content": content}
                ],
                "max_tokens": 4000
            }
        }
        batch_data.append(record)
    
    # Save as JSONL
    input_file = 'batch_input.jsonl'
    with open(input_file, 'w', encoding='utf-8') as f:
        for record in batch_data:
            f.write(json.dumps(record, ensure_ascii=False) + '\n')
    
    return input_file

def upload_to_s3(file_path, key):
    """Upload file to S3"""
    s3.upload_file(file_path, BUCKET_NAME, key)
    return f"s3://{BUCKET_NAME}/{key}"

def submit_batch_job(input_s3_uri, output_s3_uri):
    """Submit batch inference job"""
    job_name = f"batch-job-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
    
    response = bedrock.create_model_invocation_job(
        jobName=job_name,
        roleArn=f"arn:aws:iam::{boto3.client('sts').get_caller_identity()['Account']}:role/BedrockBatchRole",
        modelId=MODEL_ID,
        inputDataConfig={'s3InputDataConfig': {'s3Uri': input_s3_uri}},
        outputDataConfig={'s3OutputDataConfig': {'s3Uri': output_s3_uri}}
    )
    
    return response['jobArn']

def monitor_job(job_arn):
    """Wait for job completion"""
    while True:
        response = bedrock.get_model_invocation_job(jobIdentifier=job_arn)
        status = response['status']
        print(f"Job status: {status}")
        
        if status == 'Completed':
            return response['outputDataConfig']['s3OutputDataConfig']['s3Uri']
        elif status in ['Failed', 'Stopped']:
            raise Exception(f"Job failed with status: {status}")
        
        time.sleep(30)

def download_and_process_results(output_s3_uri):
    """Download results and save to output folder"""
    # Parse S3 URI
    bucket = output_s3_uri.split('/')[2]
    key = '/'.join(output_s3_uri.split('/')[3:])
    
    # Download output file
    output_file = 'batch_output.jsonl'
    s3.download_file(bucket, key, output_file)
    
    # Process results
    with open(output_file, 'r', encoding='utf-8') as f:
        for line in f:
            result = json.loads(line)
            record_id = result['recordId']
            
            if 'modelOutput' in result:
                content = result['modelOutput']['choices'][0]['message']['content']
                
                # Extract original filename from record_id
                filename = record_id.split('_', 2)[2]
                # Change extension to .json
                base_name = os.path.splitext(filename)[0]
                output_path = f"prompt/output/response_{base_name}.json"
                
                with open(output_path, 'w', encoding='utf-8') as out_f:
                    out_f.write(content)
                
                print(f"Saved JSON response to {output_path}")

def main():
    # Step 0: Create bucket if needed
    create_bucket_if_not_exists()
    
    # Step 1: Prepare batch input
    input_file = prepare_batch_input()
    
    # Step 2: Upload to S3
    input_key = f"batch-inputs/{input_file}"
    output_key = "batch-outputs/"
    
    input_s3_uri = upload_to_s3(input_file, input_key)
    output_s3_uri = f"s3://{BUCKET_NAME}/{output_key}"
    
    print(f"Input uploaded to: {input_s3_uri}")
    
    # Step 3: Submit batch job
    job_arn = submit_batch_job(input_s3_uri, output_s3_uri)
    print(f"Batch job submitted: {job_arn}")
    
    # Step 4: Monitor job
    result_s3_uri = monitor_job(job_arn)
    
    # Step 5: Download and process results
    download_and_process_results(result_s3_uri)
    
    print("Batch processing completed!")

if __name__ == "__main__":
    main()
