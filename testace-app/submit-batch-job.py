import boto3
import json
import glob
import os
from datetime import datetime

# Initialize clients
bedrock = boto3.client('bedrock', region_name='us-east-1')
s3 = boto3.client('s3', region_name='us-east-1')

# Configuration
BUCKET_NAME = 'your-bedrock-batch-bucket'
MODEL_ID = 'openai.gpt-oss-20b-1:0'

def create_bucket_if_not_exists():
    try:
        s3.head_bucket(Bucket=BUCKET_NAME)
    except:
        s3.create_bucket(Bucket=BUCKET_NAME)
        print(f"Created bucket: {BUCKET_NAME}")

def prepare_and_submit():
    create_bucket_if_not_exists()
    
    # Prepare batch input
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
    
    # Save and upload input
    input_file = 'batch_input.jsonl'
    with open(input_file, 'w', encoding='utf-8') as f:
        for record in batch_data:
            f.write(json.dumps(record, ensure_ascii=False) + '\n')
    
    timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
    input_key = f"batch-inputs/input-{timestamp}.jsonl"
    output_key = f"batch-outputs/output-{timestamp}/"
    
    s3.upload_file(input_file, BUCKET_NAME, input_key)
    
    # Submit job
    job_name = f"batch-job-{timestamp}"
    response = bedrock.create_model_invocation_job(
        jobName=job_name,
        roleArn=f"arn:aws:iam::{boto3.client('sts').get_caller_identity()['Account']}:role/BedrockBatchRole",
        modelId=MODEL_ID,
        inputDataConfig={'s3InputDataConfig': {'s3Uri': f"s3://{BUCKET_NAME}/{input_key}"}},
        outputDataConfig={'s3OutputDataConfig': {'s3Uri': f"s3://{BUCKET_NAME}/{output_key}"}}
    )
    
    print(f"✅ Batch job submitted successfully!")
    print(f"Job Name: {job_name}")
    print(f"Job ARN: {response['jobArn']}")
    print(f"Output will be in: s3://{BUCKET_NAME}/{output_key}")
    print(f"\nTo check status later, run:")
    print(f"python check-batch-status.py {response['jobArn']}")

if __name__ == "__main__":
    prepare_and_submit()
