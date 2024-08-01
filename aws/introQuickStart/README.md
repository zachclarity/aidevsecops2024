# AWS Intro -  Quick Start
<ul>
<li><a href="https://explore.skillbuilder.aws/learn/course/internal/view/elearning/19378/aws-cloud-quest-generative-ai">AWS Skill Builer Tech Overview</a></li>

# Summary of Course: Introduction to AWS Cloud Computing

## Key cloud computing concepts:
    * On-demand self-service
    * Broad network access
    * Resource pooling
    * Rapid elasticity
    * Measured service

### Security: IAM, KMS, Shield - AWS Security Services and Features:

#### AWS Identity and Access Management (IAM):
   - Manages access to AWS services and resources securely
   - Features:
     * Users, Groups, and Roles
     * Fine-grained permissions using IAM policies
     * Multi-Factor Authentication (MFA)
     * Password policies
     * Integration with AWS Organizations for centralized management
   - Best practices: Principle of least privilege, use of IAM roles for applications

#### AWS Organizations:
   - Centrally manage and govern multiple AWS accounts
   - Features:
     * Centralized management of AWS accounts
     * Consolidated billing
     * Hierarchical groupings of accounts
     * Service Control Policies (SCPs) for centralized policy management

#### Amazon GuardDuty:
   - Intelligent threat detection service
   - Continuously monitors AWS accounts, workloads, and data stored in S3
   - Uses machine learning, anomaly detection, and integrated threat intelligence

#### AWS Shield:
   - Managed Distributed Denial of Service (DDoS) protection service
   - Two tiers:
     * Standard: Automatically included for all AWS customers
     * Advanced: Paid service with enhanced protections and 24/7 access to AWS DDoS response team

#### AWS Web Application Firewall (WAF):
   - Protects web applications from common exploits
   - Can be deployed on Amazon CloudFront, Application Load Balancer, or API Gateway
   - Features customizable security rules to block common attack patterns

#### Amazon Inspector:
   - Automated security assessment service
   - Helps improve security and compliance of applications deployed on AWS
   - Automatically assesses applications for exposure, vulnerabilities, and deviations from best practices

#### AWS Key Management Service (KMS):
   - Create and manage cryptographic keys
   - Integrates with many AWS services for data encryption
   - Supports both symmetric and asymmetric keys

#### AWS Secrets Manager:
   - Securely store and manage sensitive information (e.g., database credentials, API keys)
   - Automatic rotation of secrets
   - Fine-grained access control using IAM policies

#### AWS Certificate Manager:
   - Provision, manage, and deploy public and private SSL/TLS certificates
   - Integrates with AWS services like Elastic Load Balancing and CloudFront

#### Amazon Macie:
    - Uses machine learning to discover, classify, and protect sensitive data
    - Provides dashboards and alerts for visibility into how data is being accessed or moved

#### AWS Security Hub:
    - Comprehensive view of security alerts and security posture across AWS accounts
    - Aggregates, organizes, and prioritizes security alerts from multiple AWS services and partner solutions

#### AWS Firewall Manager:
    - Centrally configure and manage firewall rules across accounts and applications
    - Works with AWS WAF, AWS Shield Advanced, and Amazon VPC security groups

#### AWS CloudTrail:
    - Provides governance, compliance, operational auditing, and risk auditing of your AWS account
    - Records API calls for your account and delivers log files

#### Amazon Detective:
    - Analyzes, investigates, and quickly identifies the root cause of security issues or suspicious activities

#### AWS Config:
    - Assesses, audits, and evaluates the configurations of AWS resources
    - Continuously monitors and records AWS resource configurations
    - Enables compliance auditing, security analysis, resource change tracking, and troubleshooting

#### AWS Artifact:
    - On-demand access to AWS security and compliance reports and select online agreements

#### VPC Security:
    - Network ACLs: Stateless firewall for subnets
    - Security Groups: Stateful firewall for EC2 instances
    - Flow Logs: Capture information about IP traffic going to and from network interfaces

#### AWS Systems Manager:
    - Provides a unified user interface to view operational data from multiple AWS services
    - Includes features for patching, running commands, managing parameters, and automating tasks

----

### Computing 
   - EC2 (Elastic Compute Cloud): Virtual servers in the cloud
   - Container services:
     * ECS (Elastic Container Service): Highly scalable, high-performance container orchestration service that supports Docker containers.
     * EKS (Elastic Kubernetes Service): Managed Kubernetes service that makes it easy to deploy, manage, and scale containerized applications using Kubernetes.
     * Fargate: Serverless compute engine for containers that works with both ECS and EKS.
   - Lambda: Serverless compute service


  - ECS (Elastic Container Service):
   - Fully managed container orchestration service
   - Integrates well with other AWS services
   - Simpler to use and more AWS-native compared to Kubernetes
   - Good for users who want an easier way to run containers without the complexity of Kubernetes

  - EKS (Elastic Kubernetes Service):
   - Managed Kubernetes service
   - Provides a standardized Kubernetes experience
   - Beneficial for organizations already using Kubernetes or wanting cross-cloud compatibility
   - Offers more flexibility and a larger ecosystem of tools compared to ECS

  - Fargate:
   - Serverless compute engine for containers
   - Can be used with both ECS and EKS
   - Eliminates the need to manage the underlying EC2 instances
   - Useful when you want to focus on your containers without worrying about the infrastructure

### Networking: VPC, Direct Connect, Route 53
 
   - VPC (Virtual Private Cloud): 
     * Allows you to provision a logically isolated section of the AWS Cloud
     * Control over your virtual networking environment, including IP address range, subnets, route tables, and network gateways
     * Supports both IPv4 and IPv6

   - Security Groups and Network ACLs:
     * Security Groups: Act as a virtual firewall for EC2 instances to control inbound and outbound traffic
     * Network ACLs: An optional layer of security that acts as a firewall for controlling traffic in and out of subnets

   - VPN (Virtual Private Network):
     * AWS Site-to-Site VPN: Securely connect your on-premises network or branch office site to your VPC
     * AWS Client VPN: Securely connect users to AWS or on-premises networks from any location

   - Direct Connect:
     * Dedicated network connection from your premises to AWS
     * Reduces network costs, increases bandwidth throughput, and provides a more consistent network experience than internet-based connections

   - Route 53:
     * Highly available and scalable Domain Name System (DNS) web service
     * Can be used to route users to Internet applications, manage DNS records, and register domain names

   - Elastic Load Balancing (ELB):
     * Automatically distributes incoming application traffic across multiple targets
     * Three types: Application Load Balancer (ALB), Network Load Balancer (NLB), and Classic Load Balancer

   - AWS Global Accelerator:
     * Improves availability and performance of applications with local or global users
     * Uses the AWS global network to optimize the path from users to applications

   - AWS Transit Gateway:
     * Connects VPCs and on-premises networks through a central hub
     * Simplifies network architecture and reduces operational overhead

   - AWS PrivateLink:
     * Provides private connectivity between VPCs, AWS services, and on-premises applications
     * Keeps all network traffic within the AWS network

   - Amazon CloudFront:
     * Content Delivery Network (CDN) service that securely delivers data, videos, applications, and APIs to customers globally
     * Improves read performance by caching content at edge locations worldwide

   - AWS WAF (Web Application Firewall):
     * Protects web applications from common web exploits
     * Can be deployed on Amazon CloudFront, Application Load Balancer, or API Gateway

   - AWS Shield:
     * Managed Distributed Denial of Service (DDoS) protection service
     * Safeguards applications running on AWS against DDoS attacks

### Storage: S3, EBS, EFS

   - Amazon S3 (Simple Storage Service):
     * Object storage service offering industry-leading scalability, data availability, security, and performance
     * Use cases: data lakes, websites, mobile applications, backup and restore, archive, enterprise applications, IoT devices, and big data analytics
     * Features:
       - Storage classes: S3 Standard, S3 Intelligent-Tiering, S3 Standard-IA, S3 One Zone-IA, S3 Glacier, S3 Glacier Deep Archive
       - Versioning: Maintain multiple variants of objects
       - Lifecycle management: Automate transitions between storage classes
       - Encryption: Server-side encryption (SSE) options
       - Access control: IAM policies, bucket policies, Access Control Lists (ACLs)
       - S3 Select: Retrieve subsets of data from objects using SQL-like queries

   - Amazon EBS (Elastic Block Store):
     * High-performance block storage designed for use with Amazon EC2 instances
     * Use cases: Boot volumes, database storage, enterprise applications, throughput-intensive workloads
     * Volume types:
       - General Purpose SSD (gp2 and gp3)
       - Provisioned IOPS SSD (io1 and io2)
       - Throughput Optimized HDD (st1)
       - Cold HDD (sc1)
     * Features:
       - Snapshots: Point-in-time backups stored in S3
       - Encryption: Encrypt data at rest using AWS KMS
       - Elastic Volumes: Dynamically increase capacity, tune performance, and change volume type

   - Amazon EFS (Elastic File System):
     * Fully managed file storage for use with AWS Cloud services and on-premises resources
     * Use cases: Content management, web serving, data sharing, WordPress
     * Features:
       - Elastic: Automatically grows and shrinks as you add and remove files
       - Multi-AZ redundancy: High availability and durability
       - Performance modes: General Purpose and Max I/O
       - Throughput modes: Bursting and Provisioned
       - Lifecycle management: Automatically move infrequently accessed files to lower-cost storage class

   - Amazon FSx:
     * Fully managed file storage built on widely-used file systems
     * Types:
       - FSx for Windows File Server: Fully managed Windows file servers
       - FSx for Lustre: High-performance file system for compute-intensive workloads
       - FSx for NetApp ONTAP: Fully managed ONTAP file systems
       - FSx for OpenZFS: Fully managed OpenZFS file systems

   - AWS Storage Gateway:
     * Hybrid cloud storage service that gives you on-premises access to virtually unlimited cloud storage
     * Types:
       - File Gateway: NFS and SMB interface to S3
       - Volume Gateway: iSCSI block storage volumes
       - Tape Gateway: Virtual tape library interface

   - AWS Snowball:
     * Physical device for migrating large amounts of data into and out of AWS
     * Types:
       - Snowball Edge Storage Optimized: 80 TB of HDD capacity
       - Snowball Edge Compute Optimized: 42 TB of HDD capacity with more compute capabilities
       - Snowmobile: Exabyte-scale data transfer service using a 45-foot long shipping container

   - Amazon S3 Glacier:
     * Low-cost archive storage in the cloud
     * Retrieval options: Expedited (1-5 minutes), Standard (3-5 hours), Bulk (5-12 hours)
     * Vault Lock: Enforce compliance controls


### Databases: RDS, DynamoDB, Redshift

   - Amazon RDS (Relational Database Service):
     * Managed relational database service supporting multiple engines
     * Supported database engines:
       - Amazon Aurora (MySQL and PostgreSQL-compatible)
       - MySQL
       - PostgreSQL
       - MariaDB
       - Oracle
       - Microsoft SQL Server
     * Features:
       - Automated patching, backups, and recovery
       - Multi-AZ deployments for high availability
       - Read replicas for improved read performance
       - Automated failover for Multi-AZ deployments
       - Encryption at rest and in transit
     * Use cases: Web and mobile applications, e-commerce, content management systems

   - Amazon Aurora:
     * MySQL and PostgreSQL-compatible relational database built for the cloud
     * Features:
       - Up to 5x performance of MySQL and 3x of PostgreSQL
       - Distributed, fault-tolerant, self-healing storage system
       - Auto-scaling from 10GB to 128TB
       - Up to 15 read replicas with sub-10ms replica lag
       - Serverless option for variable workloads
     * Use cases: Enterprise applications, SaaS applications, gaming applications

   - Amazon DynamoDB:
     * Fully managed NoSQL database service
     * Features:
       - Single-digit millisecond latency at any scale
       - Built-in security, backup and restore, and in-memory caching
       - Supports both document and key-value data models
       - Auto-scaling capabilities
       - Global tables for multi-region, multi-active replication
       - Transactions for multiple, all-or-nothing operations
       - On-demand capacity mode for unpredictable workloads
     * Use cases: Mobile, web, gaming, ad-tech, IoT applications

   - Amazon ElastiCache:
     * Fully managed in-memory caching service
     * Supported engines:
       - Redis
       - Memcached
     * Features:
       - Sub-millisecond latency
       - Scaling, data tiering, and cluster resizing
       - Multi-AZ with automatic failover (Redis)
       - Backup and restore capabilities (Redis)
     * Use cases: Caching, session stores, gaming leaderboards, geospatial applications

   - Amazon Redshift:
     * Fully managed, petabyte-scale data warehouse service
     * Features:
       - Columnar storage and parallel query execution
       - SQL interface for analytics
       - Integration with data lakes (S3) via Redshift Spectrum
       - Automatic tuning and scaling
       - Encryption and security features
     * Use cases: Business intelligence, predictive analytics, IoT analytics

   - Amazon DocumentDB:
     * MongoDB-compatible document database service
     * Features:
       - Supports MongoDB workloads and drivers
       - Scales compute and storage independently
       - Continuous backup to S3
       - Encryption at rest and in transit
     * Use cases: Content management, catalogs, user profiles

   - Amazon Neptune:
     * Fully managed graph database service
     * Supports property graph and RDF models
     * Features:
       - High availability with up to 15 read replicas
       - Point-in-time recovery
       - Supports open graph APIs (Apache TinkerPop and SPARQL)
     * Use cases: Social networking, fraud detection, recommendation engines, knowledge graphs

   - Amazon Quantum Ledger Database (QLDB):
     * Fully managed ledger database for applications that need a centralized, trusted authority
     * Features:
       - Immutable, transparent, and cryptographically verifiable transaction log
       - SQL-like API
       - Scalable and serverless
     * Use cases: Banking transactions, supply chain, vehicle history logs

   - Amazon Timestream:
     * Fully managed time series database service
     * Features:
       - Purpose-built for collecting, storing, and processing time-series data
       - Automatically scales up or down
       - Built-in time series analytics functions
     * Use cases: IoT applications, DevOps, industrial telemetry


### Monitoring and scaling (CloudWatch, EC2 Auto Scaling, Elastic Load Balancing)


1. Amazon CloudWatch:
   - Monitoring and observability service for AWS cloud resources and applications
   - Features:
     * Metrics: Collect and track key metrics
     * Logs: Collect, monitor, analyze, and store log files
     * Events: Respond to state changes in AWS resources
     * Alarms: Trigger notifications based on metrics
     * Dashboards: Create customizable dashboards to visualize metrics and alarms
   - Use cases: Resource performance monitoring, application monitoring, log analysis

2. AWS CloudTrail:
   - Provides governance, compliance, operational auditing, and risk auditing of your AWS account
   - Records API calls for your account and delivers log files
   - Enables security analysis, resource change tracking, and compliance auditing

3. AWS X-Ray:
   - Analyzes and debugs production, distributed applications
   - Provides an end-to-end view of requests as they travel through your application
   - Helps understand how your application and its underlying services are performing

4. Amazon EC2 Auto Scaling:
   - Automatically adjust capacity to maintain steady, predictable performance at the lowest possible cost
   - Features:
     * Scheduled Scaling: Scale based on predictable load changes
     * Dynamic Scaling: Respond to changing demand
     * Predictive Scaling: Uses machine learning to schedule the right number of EC2 instances in anticipation of traffic changes
   - Integrates with Application Load Balancer and Network Load Balancer

5. Application Auto Scaling:
   - Automatically scale AWS resources for other AWS services, such as Amazon ECS, Amazon DynamoDB, and Amazon Aurora

6. AWS Auto Scaling:
   - Centralized way to manage scaling for multiple resources across multiple services
   - Provides recommendations to optimize performance and costs

7. Elastic Load Balancing (ELB):
   - Automatically distributes incoming application traffic across multiple targets
   - Types:
     * Application Load Balancer (ALB): For HTTP/HTTPS traffic
     * Network Load Balancer (NLB): For TCP, UDP, and TLS traffic
     * Classic Load Balancer: Previous generation, for EC2-Classic network
   - Features: 
     * Health checks
     * SSL/TLS termination
     * Sticky sessions
     * Integration with AWS WAF and AWS Shield

8. Amazon EventBridge (formerly CloudWatch Events):
   - Serverless event bus that makes it easier to build event-driven applications at scale
   - Connects application data from your own apps, SaaS apps, and AWS services

9. AWS Personal Health Dashboard:
   - Provides alerts and remediation guidance when AWS is experiencing events that might affect you

10. AWS Trusted Advisor:
    - Online tool that provides real-time guidance to help you provision your resources following AWS best practices
    - Checks help optimize your AWS infrastructure, increase security and performance, reduce costs, and monitor service limits

11. Amazon Managed Grafana:
    - Fully managed service for Grafana, an open-source analytics and monitoring solution
    - Visualize and analyze metrics, logs, and traces from multiple sources

12. Amazon Managed Service for Prometheus:
    - Monitoring service for container environments compatible with Prometheus
    - Automatically scales the infrastructure needed to ingest, store, and query operational metrics

13. AWS Compute Optimizer:
    - Recommends optimal AWS compute resources for your workloads to reduce costs and improve performance
    - Uses machine learning to analyze historical utilization metrics

14. AWS CloudFormation:
    - Infrastructure as Code (IaC) service that helps model and set up AWS resources
    - Enables repeatable and scalable deployment of resources

Scaling Strategies:

1. Vertical Scaling (Scaling Up):
   - Increase the capacity of a single resource (e.g., upgrading to a larger EC2 instance type)
   - Useful for applications that are not easily distributed

2. Horizontal Scaling (Scaling Out):
   - Add more resources to distribute the load (e.g., adding more EC2 instances)
   - Typically used with Auto Scaling and Elastic Load Balancing

3. Diagonal Scaling:
   - Combination of vertical and horizontal scaling

Best Practices for Monitoring and Scaling:

1. Set up detailed monitoring for critical resources
2. Use CloudWatch alarms to trigger automated actions
3. Implement a multi-AZ architecture for high availability
4. Use Auto Scaling to handle variable loads
5. Optimize your Auto Scaling configurations based on application needs
6. Regularly review and act on Trusted Advisor recommendations
7. Use AWS X-Ray for distributed tracing in microservices architectures
8. Implement custom metrics for application-specific monitoring
9. Use CloudWatch Dashboards for a unified view of your system's health
10. Regularly review and optimize your scaling policies


<hr/>