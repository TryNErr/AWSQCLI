#!/bin/bash

# Setup script for Bedrock batch processing

echo "Setting up Bedrock batch processing..."

# 1. Create S3 bucket
BUCKET_NAME="your-bedrock-batch-bucket-$(date +%s)"
aws s3 mb s3://$BUCKET_NAME

# 2. Create IAM role for Bedrock batch
cat > bedrock-batch-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "bedrock.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

cat > bedrock-batch-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::$BUCKET_NAME",
        "arn:aws:s3:::$BUCKET_NAME/*"
      ]
    }
  ]
}
EOF

# Create role
aws iam create-role --role-name BedrockBatchRole --assume-role-policy-document file://bedrock-batch-trust-policy.json
aws iam put-role-policy --role-name BedrockBatchRole --policy-name BedrockBatchPolicy --policy-document file://bedrock-batch-policy.json

# 3. Update Python script with bucket name
sed -i "s/your-bedrock-batch-bucket/$BUCKET_NAME/g" test-bedrock-batch.py

echo "Setup complete!"
echo "Bucket created: $BUCKET_NAME"
echo "IAM role created: BedrockBatchRole"
echo "Run: python test-bedrock-batch.py"

# Cleanup temp files
rm bedrock-batch-trust-policy.json bedrock-batch-policy.json
