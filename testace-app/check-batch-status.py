import boto3
import json
import sys
import os

bedrock = boto3.client('bedrock', region_name='us-east-1')
s3 = boto3.client('s3', region_name='us-east-1')

def check_status_and_download(job_arn):
    response = bedrock.get_model_invocation_job(jobIdentifier=job_arn)
    status = response['status']
    
    print(f"Job Status: {status}")
    
    if status == 'Completed':
        print("✅ Job completed! Downloading results...")
        
        # Download results
        output_s3_uri = response['outputDataConfig']['s3OutputDataConfig']['s3Uri']
        bucket = output_s3_uri.split('/')[2]
        prefix = '/'.join(output_s3_uri.split('/')[3:])
        
        # List objects in output folder
        objects = s3.list_objects_v2(Bucket=bucket, Prefix=prefix)
        
        os.makedirs('prompt/output', exist_ok=True)
        
        for obj in objects.get('Contents', []):
            if obj['Key'].endswith('.jsonl'):
                # Download output file
                output_file = 'batch_output.jsonl'
                s3.download_file(bucket, obj['Key'], output_file)
                
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
                            
                            print(f"✅ Saved JSON response to {output_path}")
                
                os.remove(output_file)
                break
        
        print("🎉 All results downloaded to prompt/output/")
        
    elif status in ['Failed', 'Stopped']:
        print(f"❌ Job failed with status: {status}")
        if 'failureMessage' in response:
            print(f"Error: {response['failureMessage']}")
    else:
        print(f"⏳ Job still running. Status: {status}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python check-batch-status.py <job_arn>")
        sys.exit(1)
    
    job_arn = sys.argv[1]
    check_status_and_download(job_arn)
