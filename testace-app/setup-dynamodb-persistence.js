#!/usr/bin/env node

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configure AWS with non-reserved environment variables
AWS.config.update({ 
  region: process.env.TESTACE_AWS_REGION || process.env.REACT_APP_TESTACE_AWS_REGION || 'us-east-1',
  accessKeyId: process.env.TESTACE_ACCESS_KEY_ID || process.env.REACT_APP_TESTACE_ACCESS_KEY_ID,
  secretAccessKey: process.env.TESTACE_SECRET_ACCESS_KEY || process.env.REACT_APP_TESTACE_SECRET_ACCESS_KEY
});

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

console.log('🚀 Setting up DynamoDB persistence for TestAce...\n');

// Table definitions
const tables = [
  {
    TableName: 'TestAce-Questions',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'subject', AttributeType: 'S' },
      { AttributeName: 'grade', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'SubjectGradeIndex',
        KeySchema: [
          { AttributeName: 'subject', KeyType: 'HASH' },
          { AttributeName: 'grade', KeyType: 'RANGE' }
        ],
        Projection: { ProjectionType: 'ALL' },
        BillingMode: 'PAY_PER_REQUEST'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'TestAce-UserProgress',
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'TestAce-ReadingPassages',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'grade', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'GradeIndex',
        KeySchema: [
          { AttributeName: 'grade', KeyType: 'HASH' }
        ],
        Projection: { ProjectionType: 'ALL' },
        BillingMode: 'PAY_PER_REQUEST'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  },
  {
    TableName: 'TestAce-GeneratedQuestions',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'subject', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'SubjectIndex',
        KeySchema: [
          { AttributeName: 'subject', KeyType: 'HASH' }
        ],
        Projection: { ProjectionType: 'ALL' },
        BillingMode: 'PAY_PER_REQUEST'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  }
];

// Create tables
async function createTables() {
  console.log('📊 Creating DynamoDB tables...\n');
  
  for (const table of tables) {
    try {
      console.log(`Creating table: ${table.TableName}`);
      await dynamodb.createTable(table).promise();
      console.log(`✅ ${table.TableName} created successfully`);
      
      // Wait for table to be active
      await dynamodb.waitFor('tableExists', { TableName: table.TableName }).promise();
      console.log(`✅ ${table.TableName} is now active\n`);
      
    } catch (error) {
      if (error.code === 'ResourceInUseException') {
        console.log(`⚠️  ${table.TableName} already exists\n`);
      } else {
        console.error(`❌ Error creating ${table.TableName}:`, error.message);
      }
    }
  }
}

// Migrate data
async function migrateData() {
  console.log('📦 Migrating data to DynamoDB...\n');
  
  // Migrate reading passages
  try {
    const readingData = require('./frontend/src/utils/comprehensiveReadingDatabase.ts');
    console.log('Migrating reading passages...');
    
    for (const passage of readingData.comprehensiveReadingDatabase) {
      await docClient.put({
        TableName: 'TestAce-ReadingPassages',
        Item: passage
      }).promise();
    }
    console.log('✅ Reading passages migrated\n');
  } catch (error) {
    console.log('⚠️  Reading passages migration skipped (will be handled by app)\n');
  }
  
  // Migrate base questions
  try {
    const questionData = require('./frontend/src/pages/Practice/questionData.ts');
    console.log('Migrating base questions...');
    
    for (const question of questionData.questionData) {
      await docClient.put({
        TableName: 'TestAce-Questions',
        Item: {
          id: question._id,
          ...question
        }
      }).promise();
    }
    console.log('✅ Base questions migrated\n');
  } catch (error) {
    console.log('⚠️  Base questions migration skipped (will be handled by app)\n');
  }
}

// Main execution
async function main() {
  try {
    await createTables();
    await migrateData();
    
    console.log('🎉 DynamoDB setup complete!\n');
    console.log('Next steps:');
    console.log('1. Update your Amplify environment variables');
    console.log('2. Deploy the updated frontend with DynamoDB integration');
    console.log('3. Test the persistent data functionality\n');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { createTables, migrateData };
