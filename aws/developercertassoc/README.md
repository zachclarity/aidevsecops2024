# 20-Day AWS Developer Certification Study Plan

## Table of Contents
1. [Day 1: AWS Fundamentals](#day-1-aws-fundamentals)
2. [Day 2: Identity and Access Management (IAM)](#day-2-identity-and-access-management-iam)
3. [Day 3: EC2 Basics](#day-3-ec2-basics)
4. [Day 4: EC2 Advanced Features](#day-4-ec2-advanced-features)
5. [Day 5: S3 Basics](#day-5-s3-basics)
6. [Day 6: S3 Advanced Features](#day-6-s3-advanced-features)
7. [Day 7: DynamoDB Basics](#day-7-dynamodb-basics)
8. [Day 8: DynamoDB Advanced Features](#day-8-dynamodb-advanced-features)
9. [Day 9: Lambda Fundamentals](#day-9-lambda-fundamentals)
10. [Day 10: Lambda Advanced Concepts](#day-10-lambda-advanced-concepts)
11. [Day 11: API Gateway](#day-11-api-gateway)
12. [Day 12: CloudFormation](#day-12-cloudformation)
13. [Day 13: Elastic Beanstalk](#day-13-elastic-beanstalk)
14. [Day 14: CloudWatch](#day-14-cloudwatch)
15. [Day 15: SNS and SQS](#day-15-sns-and-sqs)
16. [Day 16: Cognito](#day-16-cognito)
17. [Day 17: Step Functions](#day-17-step-functions)
18. [Day 18: X-Ray](#day-18-x-ray)
19. [Day 19: Enterprise App Project (Part 1)](#day-19-enterprise-app-project-part-1)
20. [Day 20: Enterprise App Project (Part 2) and Final Review](#day-20-enterprise-app-project-part-2-and-final-review)

## Day 1: AWS Fundamentals
- Study AWS global infrastructure
- Learn about the AWS shared responsibility model
- Understand AWS pricing model
- Set up an AWS Free Tier account
- Install and configure AWS CLI

**Hands-on:**
```bash
# Configure AWS CLI
aws configure
```

## Day 2: Identity and Access Management (IAM)
- Learn IAM concepts: users, groups, roles, and policies
- Create IAM users and groups
- Apply IAM policies
- Set up Multi-Factor Authentication (MFA)

**Hands-on:**
```bash
# Create a new IAM user
aws iam create-user --user-name devuser

# Create an access key for the user
aws iam create-access-key --user-name devuser

# Attach a policy to the user
aws iam attach-user-policy --user-name devuser --policy-arn arn:aws:iam::aws:policy/AWSCloudFormationFullAccess
```

## Day 3: EC2 Basics
- Understand EC2 instance types and use cases
- Launch an EC2 instance
- Connect to an EC2 instance
- Explore Amazon Machine Images (AMIs)

**Hands-on:**
```bash
# Launch an EC2 instance
aws ec2 run-instances --image-id ami-xxxxxxxx --count 1 --instance-type t2.micro --key-name MyKeyPair --security-group-ids sg-xxxxxxxx

# Describe the instance
aws ec2 describe-instances --instance-ids i-xxxxxxxxxxxxxxxxx
```

## Day 4: EC2 Advanced Features
- Work with Elastic IP addresses
- Set up and use Security Groups
- Implement Auto Scaling
- Configure Elastic Load Balancing

**Hands-on:**
```bash
# Allocate an Elastic IP
aws ec2 allocate-address

# Associate Elastic IP with an instance
aws ec2 associate-address --instance-id i-xxxxxxxxxxxxxxxxx --allocation-id eipalloc-xxxxxxxxxxxxxxxxx
```

## Day 5: S3 Basics
- Understand S3 concepts: buckets, objects, and keys
- Create and configure S3 buckets
- Upload, download, and manage objects
- Learn about S3 storage classes

**Hands-on:**
```bash
# Create an S3 bucket
aws s3 mb s3://my-unique-bucket-name-xxx

# Upload a file to S3
aws s3 cp myfile.txt s3://my-unique-bucket-name-xxx/
```

## Day 6: S3 Advanced Features
- Implement bucket policies and Access Control Lists (ACLs)
- Set up S3 versioning
- Configure S3 lifecycle policies
- Use S3 for static website hosting

**Hands-on:**
```bash
# Enable versioning on a bucket
aws s3api put-bucket-versioning --bucket my-unique-bucket-name-xxx --versioning-configuration Status=Enabled

# Set up a lifecycle policy
aws s3api put-bucket-lifecycle-configuration --bucket my-unique-bucket-name-xxx --lifecycle-configuration file://lifecycle-config.json
```

## Day 7: DynamoDB Basics
- Understand DynamoDB concepts: tables, items, and attributes
- Create DynamoDB tables
- Perform basic read and write operations
- Learn about primary keys and indexes

**Hands-on:**
```bash
# Create a DynamoDB table
aws dynamodb create-table --table-name MyTable --attribute-definitions AttributeName=ID,AttributeType=S --key-schema AttributeName=ID,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

# Put an item in the table
aws dynamodb put-item --table-name MyTable --item '{"ID": {"S": "001"}, "Name": {"S": "John Doe"}}'
```

## Day 8: DynamoDB Advanced Features
- Implement secondary indexes
- Use DynamoDB Streams
- Practice with batch operations
- Explore DynamoDB's consistency models

**Hands-on:**
```bash
# Add a global secondary index
aws dynamodb update-table --table-name MyTable --attribute-definitions AttributeName=Name,AttributeType=S --global-secondary-index-updates "[{\"Create\":{\"IndexName\": \"NameIndex\",\"KeySchema\":[{\"AttributeName\":\"Name\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"},\"ProvisionedThroughput\":{\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}}}]"
```

## Day 9: Lambda Fundamentals
- Understand serverless computing concepts
- Create and deploy basic Lambda functions
- Configure Lambda function settings
- Explore Lambda execution models

**Hands-on:**
```bash
# Create a Lambda function (assuming you have a deployment package)
aws lambda create-function --function-name my-function --runtime python3.8 --role arn:aws:iam::123456789012:role/lambda-role --handler lambda_function.lambda_handler --zip-file fileb://my-deployment-package.zip

# Invoke the Lambda function
aws lambda invoke --function-name my-function --payload '{"key1": "value1", "key2": "value2"}' output.txt
```

## Day 10: Lambda Advanced Concepts
- Implement Lambda layers
- Use environment variables with Lambda
- Set up Lambda function URLs
- Practice error handling and logging in Lambda

**Hands-on:**
```bash
# Create a Lambda layer
aws lambda publish-layer-version --layer-name my-layer --description "My dependencies" --zip-file fileb://layer.zip --compatible-runtimes python3.8

# Update a function to use the layer
aws lambda update-function-configuration --function-name my-function --layers arn:aws:lambda:us-east-1:123456789012:layer:my-layer:1
```

## Day 11: API Gateway
- Understand RESTful API concepts
- Create and deploy an API using API Gateway
- Implement API methods and resources
- Set up request/response mappings

**Hands-on:**
```bash
# Create an API
aws apigateway create-rest-api --name 'My API' --description 'This is my API'

# Create a resource
aws apigateway create-resource --rest-api-id 1234123412 --parent-id a1b2c3d4e5 --path-part 'myresource'
```

## Day 12: CloudFormation
- Learn Infrastructure as Code concepts
- Write basic CloudFormation templates
- Deploy and update CloudFormation stacks
- Use CloudFormation parameters and outputs

**Hands-on:**
```bash
# Create a CloudFormation stack
aws cloudformation create-stack --stack-name my-network-stack --template-body file://network-stack.yml

# Update a stack
aws cloudformation update-stack --stack-name my-network-stack --template-body file://updated-network-stack.yml
```

## Day 13: Elastic Beanstalk
- Understand Elastic Beanstalk concepts
- Deploy an application using Elastic Beanstalk
- Configure Elastic Beanstalk environments
- Manage application versions and deployments

**Hands-on:**
```bash
# Create an Elastic Beanstalk application
aws elasticbeanstalk create-application --application-name my-app --description "My application"

# Create an environment
aws elasticbeanstalk create-environment --application-name my-app --environment-name my-env --solution-stack-name "64bit Amazon Linux 2 v3.4.0 running Python 3.8"
```

## Day 14: CloudWatch
- Set up basic monitoring for AWS resources
- Create custom CloudWatch metrics
- Configure CloudWatch alarms
- Implement CloudWatch Logs

**Hands-on:**
```bash
# Create a CloudWatch alarm
aws cloudwatch put-metric-alarm --alarm-name cpu-mon --alarm-description "Alarm when CPU exceeds 70%" --metric-name CPUUtilization --namespace AWS/EC2 --statistic Average --period 300 --threshold 70 --comparison-operator GreaterThanThreshold --dimensions Name=InstanceId,Value=i-12345678 --evaluation-periods 2 --alarm-actions arn:aws:sns:us-east-1:111122223333:MyTopic --unit Percent
```

## Day 15: SNS and SQS
- Understand messaging and queueing in AWS
- Create and configure SNS topics
- Set up SQS queues
- Implement pub/sub patterns with SNS and SQS

**Hands-on:**
```bash
# Create an SNS topic
aws sns create-topic --name my-topic

# Create an SQS queue
aws sqs create-queue --queue-name my-queue
```

## Day 16: Cognito
- Learn about user authentication and authorization
- Set up Cognito User Pools
- Implement Cognito Identity Pools
- Integrate Cognito with other AWS services

**Hands-on:**
```bash
# Create a Cognito User Pool
aws cognito-idp create-user-pool --pool-name my-user-pool

# Create a Cognito Identity Pool
aws cognito-identity create-identity-pool --identity-pool-name my-identity-pool --allow-unauthenticated-identities
```

## Day 17: Step Functions
- Understand workflow orchestration in AWS
- Design and implement state machines
- Use Step Functions to coordinate multiple AWS services
- Practice error handling and retries in Step Functions

**Hands-on:**
```bash
# Create a Step Functions state machine
aws stepfunctions create-state-machine --name "MyStateMachine" --definition file://statemachine.json --role-arn arn:aws:iam::123456789012:role/service-role/StepFunctions-MyStateMachine-role-1234abcd
```

## Day 18: X-Ray
- Learn about distributed tracing
- Instrument applications with X-Ray
- Analyze and debug applications using X-Ray
- Implement X-Ray sampling rules

**Hands-on:**
```bash
# Create an X-Ray sampling rule
aws xray create-sampling-rule --cli-input-json file://sampling-rule.json
```

## Day 19: Enterprise App Project (Part 1)
Start building a sample enterprise application that incorporates multiple AWS services:
- Set up user authentication with Cognito
- Create API endpoints with API Gateway
- Implement Lambda functions for backend logic
- Use DynamoDB for data storage

## Day 20: Enterprise App Project (Part 2) and Final Review
- Complete the enterprise app by adding:
  - S3 for file storage
  - CloudFront for content delivery
  - Step Functions for complex workflows
  - SNS for notifications
- Review key concepts from all previous days
- Take practice exams
- Identify and study weak areas

