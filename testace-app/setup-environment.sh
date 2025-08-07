#!/bin/bash

echo "🔧 Setting up TestAce environment for DynamoDB persistence..."

# Create .env file for frontend
cat > frontend/.env.production << EOF
REACT_APP_USE_DYNAMODB=true
REACT_APP_AWS_REGION=us-east-1
REACT_APP_AWS_ACCESS_KEY_ID=\${AWS_ACCESS_KEY_ID}
REACT_APP_AWS_SECRET_ACCESS_KEY=\${AWS_SECRET_ACCESS_KEY}
EOF

echo "✅ Created frontend/.env.production"

# Create .env file for development
cat > frontend/.env.development << EOF
REACT_APP_USE_DYNAMODB=false
REACT_APP_AWS_REGION=us-east-1
EOF

echo "✅ Created frontend/.env.development"

# Add AWS SDK dependency
echo "📦 Adding AWS SDK dependency..."
cd frontend && npm install aws-sdk
cd ..

echo "🎉 Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Set your AWS credentials in Amplify environment variables:"
echo "   - AWS_ACCESS_KEY_ID"
echo "   - AWS_SECRET_ACCESS_KEY"
echo "   - AWS_REGION (default: us-east-1)"
echo ""
echo "2. Run the DynamoDB setup script:"
echo "   node setup-dynamodb-persistence.js"
echo ""
echo "3. Deploy to Amplify"
