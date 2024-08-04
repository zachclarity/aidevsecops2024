## AWS Service Permissions for DevOps

### EC2 (Elastic Compute Cloud): Full access
* Why: DevOps often needs to manage virtual servers, including launching, stopping, and configuring instances. They may need to set up development, staging, and production environments.

### S3 (Simple Storage Service): Full access
* Why: S3 is commonly used for storing application assets, backups, and deployment artifacts. DevOps needs to manage buckets, upload/download files, and set permissions.

### CloudFormation: Full access
* Why: CloudFormation is crucial for infrastructure as code. DevOps uses it to create, update, and delete AWS resources in a controlled, templated manner.

### IAM (Identity and Access Management): Limited access
* Why: DevOps needs to create and manage roles and policies for services and applications, but full access to IAM can be risky. Limited access allows creating necessary roles without full control over all IAM resources.

### CodePipeline: Full access
* Why: CodePipeline is used for continuous integration and delivery (CI/CD). DevOps needs to create, modify, and manage pipelines for automating application deployments.

### CodeBuild: Full access
* Why: CodeBuild is used for compiling source code, running tests, and producing deployment packages. DevOps needs to set up and manage build projects.

### CodeDeploy: Full access
* Why: CodeDeploy automates application deployments to various compute services. DevOps needs to create and manage deployment configurations and groups.

### CloudWatch: Full access
* Why: CloudWatch is essential for monitoring and logging. DevOps needs to set up alarms, create dashboards, and analyze logs for troubleshooting and performance optimization.

### VPC (Virtual Private Cloud): Full access
* Why: VPC configuration is crucial for network security and isolation. DevOps needs to set up and manage network configurations, including subnets, route tables, and security groups.

### Lambda: Full access
* Why: Lambda is used for serverless computing. DevOps often needs to deploy and manage serverless functions for various purposes, including API backends and task automation.

### ECS/ECR (Elastic Container Service/Elastic Container Registry): Full access
* Why: If using containers, DevOps needs to manage container registries, task definitions, and container orchestration.

### RDS (Relational Database Service): Full access
* Why: For managing relational databases, DevOps needs to create, modify, and monitor database instances.

### Cognito: Full access
* Why: Cognito is used for user authentication and authorization. DevOps needs to set up and manage user pools, identity pools, and configure authentication flows.

### DynamoDB: Full access
* Why: As the backend database, DevOps needs to create and manage tables, set up indexes, and configure read/write capacity.

### ElastiCache (for Redis): Full access
* Why: For managing Redis as a caching layer, DevOps needs to create and configure Redis clusters, set up subnet groups, and manage parameter groups.

### CloudFront: Full access
* Why: CloudFront is often used for content delivery of React web apps. DevOps needs to create and manage distributions, set up origins, and configure caching behaviors.

### Route 53: Full access
* Why: For DNS management, DevOps needs to create and manage hosted zones, record sets, and configure domain routing.

### ACM (AWS Certificate Manager): Full access
* Why: For SSL/TLS certificates, DevOps needs to request, import, and manage certificates for secure connections.

### API Gateway: Full access
* Why: If using serverless architecture, API Gateway is often used to create, publish, and manage APIs that trigger Lambda functions.
