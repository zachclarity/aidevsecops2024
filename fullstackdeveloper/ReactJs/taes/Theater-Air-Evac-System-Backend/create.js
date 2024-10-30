// Import the AWS SDK
const AWS = require('aws-sdk');

// Configure the AWS SDK to connect to DynamoDB local
AWS.config.update({
  region: 'us-west-2',  // Set the region
  endpoint: 'http://localhost:9911'  // DynamoDB local endpoint
});

// Create DynamoDB service object
const dynamoDB = new AWS.DynamoDB();

// Define parameters to create the table
const params = {
  TableName: 'taes',
  KeySchema: [
    { AttributeName: 'patientId', KeyType: 'HASH' }  // Partition key
  ],
  AttributeDefinitions: [
    { AttributeName: 'patientId', AttributeType: 'S' }  // 'S' indicates a String
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};

// Function to create the table
const createTable = async () => {
  try {
    const data = await dynamoDB.createTable(params).promise();
    console.log('Table created successfully:', data.TableDescription.TableName);
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

// Call the function
createTable();
