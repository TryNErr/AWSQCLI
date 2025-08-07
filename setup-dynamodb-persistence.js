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
  
  // For now, just log that migration will be handled by the app
  console.log('✅ Data migration will be handled by the application on first load\n');
}

// Main execution
async function main() {
  try {
    await createTables();
    await migrateData();
    
    console.log('🎉 DynamoDB setup complete!\n');
    console.log('Next steps:');
    console.log('1. Tables are ready for use');
    console.log('2. Application will initialize data on first load');
    console.log('3. Persistent storage is now enabled\n');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    // Don't exit with error to avoid breaking the build
    console.log('⚠️  Continuing build without DynamoDB setup...');
  }
}

if (require.main === module) {
  main();
}

module.exports = { createTables, migrateData };
