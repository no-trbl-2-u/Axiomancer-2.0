# AWS Deployment Guide for Axiomancer

This comprehensive guide will walk you through deploying the Axiomancer game application to AWS from scratch, starting with a new AWS account to a fully deployed production application.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [AWS Account Setup](#aws-account-setup)
3. [Traditional Deployment (EC2 + RDS + CloudFront)](#traditional-deployment)
4. [Deployment Steps](#deployment-steps)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)
7. [Serverless Deployment Alternative](#serverless-deployment-alternative)

---

## Prerequisites

Before starting, ensure you have:
- A valid credit/debit card for AWS account setup
- Basic command-line knowledge
- Docker and Docker Compose installed locally (for testing)
- AWS CLI installed (we'll configure this during setup)
- A domain name (optional but recommended)

---

## AWS Account Setup

### Step 1: Create AWS Account

1. **Navigate to AWS**: Go to [https://aws.amazon.com](https://aws.amazon.com)
2. **Click "Create an AWS Account"**
3. **Fill in account details**:
   - Email address
   - Account name (e.g., "Axiomancer Production")
   - Choose "Personal" or "Professional" account type
4. **Enter payment information**: AWS requires a credit card (you'll get free tier benefits)
5. **Verify identity**: Complete phone verification
6. **Choose support plan**: Select "Basic Support - Free"
7. **Wait for activation**: This can take up to 24 hours

### Step 2: Secure Your Root Account

1. **Enable MFA (Multi-Factor Authentication)**:
   - Go to IAM Console → Users → Root user
   - Click "Manage MFA"
   - Choose "Virtual MFA device" (use Google Authenticator or Authy)
   - Scan QR code and enter two consecutive codes

2. **Create IAM Admin User**:
   ```bash
   # In AWS Console:
   # Services → IAM → Users → Add User
   # Username: admin-user
   # Access type: Both programmatic and console access
   # Attach policies: AdministratorAccess
   # Download credentials CSV file
   ```

3. **Sign out and sign in as IAM user** (not root) for all future operations

### Step 3: Install and Configure AWS CLI

```bash
# Install AWS CLI (macOS/Linux)
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# For Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS CLI
aws configure
# Enter:
# - AWS Access Key ID (from IAM user credentials)
# - AWS Secret Access Key (from IAM user credentials)
# - Default region: us-east-1 (or your preferred region)
# - Default output format: json
```

### Step 4: Create Key Pair for EC2 Access

```bash
# Create EC2 key pair
aws ec2 create-key-pair \
  --key-name axiomancer-key \
  --query 'KeyMaterial' \
  --output text > ~/.ssh/axiomancer-key.pem

# Set proper permissions
chmod 400 ~/.ssh/axiomancer-key.pem
```

---

## Traditional Deployment

### Architecture Overview

The traditional deployment uses:
- **Amazon RDS (PostgreSQL)**: Managed database service
- **Amazon EC2**: Virtual server to run Docker containers
- **Amazon S3 + CloudFront**: CDN for serving the frontend SPA
- **Application Load Balancer**: For SSL/TLS and traffic distribution
- **Route 53**: DNS management (if using custom domain)

### Cost Estimate
- EC2 t3.small: ~$15-20/month
- RDS db.t3.micro: ~$15-20/month
- S3 + CloudFront: ~$1-5/month (depending on traffic)
- Load Balancer: ~$16-20/month
- **Total**: ~$50-70/month

---

## Deployment Steps

### Phase 1: Database Setup (RDS PostgreSQL)

#### Step 1: Create RDS PostgreSQL Instance

```bash
# Create security group for RDS
aws ec2 create-security-group \
  --group-name axiomancer-db-sg \
  --description "Security group for Axiomancer PostgreSQL database" \
  --vpc-id vpc-xxxxxxxxx  # Get your default VPC ID first

# Get default VPC ID
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text)

# Create security group with the VPC ID
DB_SG_ID=$(aws ec2 create-security-group \
  --group-name axiomancer-db-sg \
  --description "Security group for Axiomancer PostgreSQL database" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

echo "Database Security Group ID: $DB_SG_ID"

# Allow PostgreSQL access (we'll restrict this to EC2 security group later)
aws ec2 authorize-security-group-ingress \
  --group-id $DB_SG_ID \
  --protocol tcp \
  --port 5432 \
  --cidr 10.0.0.0/8
```

#### Step 2: Create RDS Subnet Group

```bash
# Get subnet IDs from default VPC
SUBNET_IDS=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query "Subnets[*].SubnetId" \
  --output text | tr '\t' ' ')

# Create DB subnet group
aws rds create-db-subnet-group \
  --db-subnet-group-name axiomancer-db-subnet-group \
  --db-subnet-group-description "Subnet group for Axiomancer database" \
  --subnet-ids $SUBNET_IDS
```

#### Step 3: Create RDS Instance

```bash
# Generate a secure database password
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
echo "Database Password (save this!): $DB_PASSWORD"

# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier axiomancer-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 16.1 \
  --master-username axiomancer \
  --master-user-password "$DB_PASSWORD" \
  --allocated-storage 20 \
  --storage-type gp3 \
  --db-name axiomancer \
  --vpc-security-group-ids $DB_SG_ID \
  --db-subnet-group-name axiomancer-db-subnet-group \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "sun:04:00-sun:05:00" \
  --enable-cloudwatch-logs-exports '["postgresql"]' \
  --no-publicly-accessible \
  --tags Key=Project,Value=Axiomancer

# Wait for RDS instance to be available (takes 5-10 minutes)
echo "Waiting for RDS instance to become available..."
aws rds wait db-instance-available --db-instance-identifier axiomancer-db

# Get RDS endpoint
DB_ENDPOINT=$(aws rds describe-db-instances \
  --db-instance-identifier axiomancer-db \
  --query "DBInstances[0].Endpoint.Address" \
  --output text)

echo "Database Endpoint: $DB_ENDPOINT"
```

### Phase 2: EC2 Instance Setup

#### Step 1: Create EC2 Security Group

```bash
# Create security group for EC2
EC2_SG_ID=$(aws ec2 create-security-group \
  --group-name axiomancer-ec2-sg \
  --description "Security group for Axiomancer EC2 instance" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

echo "EC2 Security Group ID: $EC2_SG_ID"

# Allow SSH access (replace with your IP for security)
MY_IP=$(curl -s https://checkip.amazonaws.com)
aws ec2 authorize-security-group-ingress \
  --group-id $EC2_SG_ID \
  --protocol tcp \
  --port 22 \
  --cidr "${MY_IP}/32"

# Allow HTTP access (for backend API)
aws ec2 authorize-security-group-ingress \
  --group-id $EC2_SG_ID \
  --protocol tcp \
  --port 3001 \
  --cidr 0.0.0.0/0

# Allow HTTPS access (for later SSL setup)
aws ec2 authorize-security-group-ingress \
  --group-id $EC2_SG_ID \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# Allow HTTP (port 80)
aws ec2 authorize-security-group-ingress \
  --group-id $EC2_SG_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0
```

#### Step 2: Update Database Security Group

```bash
# Allow database access from EC2 security group only
aws ec2 authorize-security-group-ingress \
  --group-id $DB_SG_ID \
  --protocol tcp \
  --port 5432 \
  --source-group $EC2_SG_ID

# Revoke the previous wide-open rule
aws ec2 revoke-security-group-ingress \
  --group-id $DB_SG_ID \
  --protocol tcp \
  --port 5432 \
  --cidr 10.0.0.0/8
```

#### Step 3: Launch EC2 Instance

```bash
# Get latest Amazon Linux 2023 AMI
AMI_ID=$(aws ec2 describe-images \
  --owners amazon \
  --filters "Name=name,Values=al2023-ami-2023*-x86_64" \
  --query "Images | sort_by(@, &CreationDate) | [-1].ImageId" \
  --output text)

# Launch EC2 instance
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id $AMI_ID \
  --instance-type t3.small \
  --key-name axiomancer-key \
  --security-group-ids $EC2_SG_ID \
  --user-data file://ec2-user-data.sh \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=Axiomancer-Server},{Key=Project,Value=Axiomancer}]' \
  --query 'Instances[0].InstanceId' \
  --output text)

echo "EC2 Instance ID: $INSTANCE_ID"

# Wait for instance to be running
echo "Waiting for EC2 instance to start..."
aws ec2 wait instance-running --instance-ids $INSTANCE_ID

# Get public IP
INSTANCE_IP=$(aws ec2 describe-instances \
  --instance-ids $INSTANCE_ID \
  --query "Reservations[0].Instances[0].PublicIpAddress" \
  --output text)

echo "EC2 Instance IP: $INSTANCE_IP"
```

#### Step 4: Create EC2 User Data Script

Before launching the instance, create `ec2-user-data.sh`:

```bash
cat > ec2-user-data.sh << 'EOF'
#!/bin/bash
set -e

# Update system
yum update -y

# Install Docker
yum install -y docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Git
yum install -y git

# Create application directory
mkdir -p /opt/axiomancer
chown ec2-user:ec2-user /opt/axiomancer

echo "EC2 setup complete!"
EOF
```

### Phase 3: Deploy Application to EC2

#### Step 1: SSH into EC2 Instance

```bash
# Wait a few minutes for user data script to complete
sleep 120

# SSH into instance
ssh -i ~/.ssh/axiomancer-key.pem ec2-user@$INSTANCE_IP
```

#### Step 2: Clone and Configure Application

```bash
# On EC2 instance
cd /opt/axiomancer

# Clone your repository
git clone https://github.com/your-username/axiomancer.git .

# Or upload files using scp from your local machine:
# scp -i ~/.ssh/axiomancer-key.pem -r /path/to/axiomancer/* ec2-user@$INSTANCE_IP:/opt/axiomancer/

# Create .env file
cat > .env << EOF
DB_PASSWORD=YOUR_DB_PASSWORD_HERE
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
DB_HOST=YOUR_RDS_ENDPOINT_HERE
DB_PORT=5432
DB_NAME=axiomancer
DB_USER=axiomancer
EOF

# Build and start containers
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Phase 4: Frontend Deployment (S3 + CloudFront)

For optimal performance, we'll deploy the frontend SPA to S3 with CloudFront CDN.

#### Step 1: Create S3 Bucket

```bash
# Create unique bucket name
BUCKET_NAME="axiomancer-frontend-$(date +%s)"

# Create S3 bucket
aws s3 mb s3://$BUCKET_NAME --region us-east-1

# Enable static website hosting
aws s3 website s3://$BUCKET_NAME \
  --index-document index.html \
  --error-document index.html

# Create bucket policy for public read access
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
    }
  ]
}
EOF

# Apply bucket policy
aws s3api put-bucket-policy \
  --bucket $BUCKET_NAME \
  --policy file://bucket-policy.json

# Block public access at account level (but allow our policy)
aws s3api put-public-access-block \
  --bucket $BUCKET_NAME \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

#### Step 2: Build and Upload Frontend

```bash
# On your local machine, build the frontend
cd axiomancer-frontend

# Update API endpoint in your frontend code if needed
# Edit src/services/auth.service.ts or similar to point to:
# http://$INSTANCE_IP:3001 or your domain

# Build production bundle
npm run build

# Upload to S3
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete

# Set cache headers
aws s3 cp s3://$BUCKET_NAME/ s3://$BUCKET_NAME/ \
  --exclude "*" \
  --include "*.js" \
  --include "*.css" \
  --recursive \
  --metadata-directive REPLACE \
  --cache-control "max-age=31536000,public" \
  --content-type "text/css"

aws s3 cp s3://$BUCKET_NAME/index.html s3://$BUCKET_NAME/index.html \
  --metadata-directive REPLACE \
  --cache-control "max-age=0,no-cache,no-store,must-revalidate"
```

#### Step 3: Create CloudFront Distribution

```bash
# Create CloudFront distribution
cat > cloudfront-config.json << EOF
{
  "CallerReference": "axiomancer-$(date +%s)",
  "Comment": "Axiomancer Frontend Distribution",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-${BUCKET_NAME}",
        "DomainName": "${BUCKET_NAME}.s3-website-us-east-1.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-${BUCKET_NAME}",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "Compress": true
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      }
    ]
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}
EOF

# Create distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json

# Get CloudFront domain name
CLOUDFRONT_DOMAIN=$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Comment=='Axiomancer Frontend Distribution'].DomainName" \
  --output text)

echo "CloudFront Domain: $CLOUDFRONT_DOMAIN"
```

### Phase 5: Application Load Balancer (Optional for SSL)

If you want SSL/TLS for your backend API:

#### Step 1: Request SSL Certificate

```bash
# Request certificate from ACM (must be in us-east-1 for CloudFront)
aws acm request-certificate \
  --domain-name api.yourdomain.com \
  --validation-method DNS \
  --subject-alternative-names api.yourdomain.com \
  --region us-east-1

# Follow email or DNS validation steps in AWS Console
```

#### Step 2: Create Application Load Balancer

```bash
# Create target group
TARGET_GROUP_ARN=$(aws elbv2 create-target-group \
  --name axiomancer-backend-tg \
  --protocol HTTP \
  --port 3001 \
  --vpc-id $VPC_ID \
  --health-check-path /health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)

# Register EC2 instance with target group
aws elbv2 register-targets \
  --target-group-arn $TARGET_GROUP_ARN \
  --targets Id=$INSTANCE_ID

# Get subnet IDs
SUBNET_ID_1=$(echo $SUBNET_IDS | awk '{print $1}')
SUBNET_ID_2=$(echo $SUBNET_IDS | awk '{print $2}')

# Create Application Load Balancer
ALB_ARN=$(aws elbv2 create-load-balancer \
  --name axiomancer-alb \
  --subnets $SUBNET_ID_1 $SUBNET_ID_2 \
  --security-groups $EC2_SG_ID \
  --scheme internet-facing \
  --type application \
  --ip-address-type ipv4 \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text)

# Create HTTPS listener (requires ACM certificate)
aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=YOUR_CERTIFICATE_ARN \
  --default-actions Type=forward,TargetGroupArn=$TARGET_GROUP_ARN

# Create HTTP listener (redirect to HTTPS)
aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=redirect,RedirectConfig='{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}'
```

---

## Post-Deployment Configuration

### Update Frontend API Endpoint

Update your frontend to use the production API endpoint:

```typescript
// axiomancer-frontend/src/services/auth.service.ts
const API_URL = import.meta.env.PROD 
  ? 'https://api.yourdomain.com' // or http://INSTANCE_IP:3001
  : 'http://localhost:3001';
```

Rebuild and redeploy frontend:

```bash
npm run build
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Configure CORS

Update backend CORS settings in `axiomancer-backend/src/index.ts`:

```typescript
app.use(cors({
  origin: [
    'https://YOUR_CLOUDFRONT_DOMAIN.cloudfront.net',
    'https://yourdomain.com'
  ],
  credentials: true
}));
```

Redeploy backend:

```bash
ssh -i ~/.ssh/axiomancer-key.pem ec2-user@$INSTANCE_IP
cd /opt/axiomancer
git pull
docker-compose down
docker-compose up -d --build
```

---

## Monitoring and Maintenance

### Set Up CloudWatch Alarms

```bash
# CPU Utilization alarm
aws cloudwatch put-metric-alarm \
  --alarm-name axiomancer-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=InstanceId,Value=$INSTANCE_ID

# RDS Storage alarm
aws cloudwatch put-metric-alarm \
  --alarm-name axiomancer-low-storage \
  --alarm-description "Alert when free storage falls below 2GB" \
  --metric-name FreeStorageSpace \
  --namespace AWS/RDS \
  --statistic Average \
  --period 300 \
  --evaluation-periods 1 \
  --threshold 2000000000 \
  --comparison-operator LessThanThreshold \
  --dimensions Name=DBInstanceIdentifier,Value=axiomancer-db
```

### Backup Strategy

#### RDS Automated Backups
RDS automatically creates daily backups (configured during creation). To create manual snapshot:

```bash
aws rds create-db-snapshot \
  --db-instance-identifier axiomancer-db \
  --db-snapshot-identifier axiomancer-db-snapshot-$(date +%Y%m%d)
```

#### Application Backup Script

Create a backup script on EC2:

```bash
cat > /opt/axiomancer/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/axiomancer/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
docker exec axiomancer-db pg_dump -U axiomancer axiomancer > $BACKUP_DIR/db_$DATE.sql

# Upload to S3
aws s3 cp $BACKUP_DIR/db_$DATE.sql s3://axiomancer-backups/db_$DATE.sql

# Keep only last 7 days locally
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: db_$DATE.sql"
EOF

chmod +x /opt/axiomancer/backup.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/axiomancer/backup.sh") | crontab -
```

### Logging

View application logs:

```bash
# Backend logs
docker logs -f axiomancer-backend

# Database logs (in CloudWatch)
aws logs tail /aws/rds/instance/axiomancer-db/postgresql --follow

# CloudFront access logs (requires setup)
aws s3 sync s3://axiomancer-cloudfront-logs/ ./logs/
```

### Updating Application

```bash
# SSH into EC2
ssh -i ~/.ssh/axiomancer-key.pem ec2-user@$INSTANCE_IP

# Pull latest code
cd /opt/axiomancer
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Update frontend
cd axiomancer-frontend
npm run build
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## Serverless Deployment Alternative

For a more cost-effective, scalable deployment without managing servers, you can use AWS Lambda for the backend and S3+CloudFront for the frontend. This approach eliminates Docker for the backend but requires code modifications.

### Architecture Overview

**Serverless Stack:**
- **AWS Lambda + API Gateway**: Backend API (no servers to manage)
- **Amazon DynamoDB** or **Aurora Serverless v2**: Database
- **Amazon S3 + CloudFront**: Frontend hosting and CDN
- **AWS Cognito** (optional): User authentication
- **Amazon EventBridge** (optional): Scheduled tasks

**Benefits:**
- Pay only for actual usage (can be < $5/month for low traffic)
- Auto-scaling
- No server maintenance
- High availability by default

**Trade-offs:**
- Cold start latency (1-3 seconds for first request)
- 15-minute maximum execution time per request
- Requires code restructuring
- Different database approach (DynamoDB vs PostgreSQL)

### Cost Estimate
- Lambda: ~$0.20-2/month (1M requests free tier)
- DynamoDB: ~$1-5/month (25GB free tier)
- API Gateway: ~$3.50/month (1M requests)
- S3 + CloudFront: ~$1-5/month
- **Total**: ~$5-15/month (vs $50-70 traditional)

---

## Serverless Deployment Steps

### Prerequisites

```bash
# Install Serverless Framework
npm install -g serverless

# Install AWS SAM CLI (alternative to Serverless Framework)
brew install aws-sam-cli  # macOS
# Or download from: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

# We'll use Serverless Framework for this guide
```

### Option A: Using Serverless Framework

#### Step 1: Restructure Backend for Lambda

Create a new serverless backend structure:

```bash
# In your project root
mkdir axiomancer-serverless
cd axiomancer-serverless
npm init -y
npm install --save serverless serverless-offline serverless-dotenv-plugin
```

#### Step 2: Create Serverless Configuration

```yaml
# serverless.yml
service: axiomancer-api

frameworkVersion: '3'

provider:
  name: aws
  runtime: nodejs20.x
  region: us-east-1
  stage: ${opt:stage, 'prod'}
  memorySize: 512
  timeout: 29  # API Gateway max is 29 seconds
  
  environment:
    NODE_ENV: production
    JWT_SECRET: ${env:JWT_SECRET}
    DYNAMODB_TABLE: ${self:service}-${self:provider.stage}
  
  iamRoleStatements:
    - Effect: Allow
      Action:
        - dynamodb:Query
        - dynamodb:Scan
        - dynamodb:GetItem
        - dynamodb:PutItem
        - dynamodb:UpdateItem
        - dynamodb:DeleteItem
      Resource:
        - "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.DYNAMODB_TABLE}"

plugins:
  - serverless-offline
  - serverless-dotenv-plugin

functions:
  # Health check
  health:
    handler: src/handlers/health.handler
    events:
      - http:
          path: /health
          method: get
          cors: true

  # Auth endpoints
  register:
    handler: src/handlers/auth.register
    events:
      - http:
          path: /api/auth/register
          method: post
          cors: true

  login:
    handler: src/handlers/auth.login
    events:
      - http:
          path: /api/auth/login
          method: post
          cors: true

  verifyToken:
    handler: src/handlers/auth.verifyToken
    events:
      - http:
          path: /api/auth/verify
          method: get
          cors: true

  # Character endpoints
  saveCharacter:
    handler: src/handlers/character.save
    events:
      - http:
          path: /api/character/save
          method: post
          cors: true

  loadCharacter:
    handler: src/handlers/character.load
    events:
      - http:
          path: /api/character/load
          method: get
          cors: true

  deleteCharacter:
    handler: src/handlers/character.delete
    events:
      - http:
          path: /api/character/delete
          method: delete
          cors: true

resources:
  Resources:
    # DynamoDB Tables
    UsersTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:provider.environment.DYNAMODB_TABLE}-users
        BillingMode: PAY_PER_REQUEST
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
          - AttributeName: email
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        GlobalSecondaryIndexes:
          - IndexName: EmailIndex
            KeySchema:
              - AttributeName: email
                KeyType: HASH
            Projection:
              ProjectionType: ALL

    CharacterStatesTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:provider.environment.DYNAMODB_TABLE}-characters
        BillingMode: PAY_PER_REQUEST
        AttributeDefinitions:
          - AttributeName: userId
            AttributeType: S
        KeySchema:
          - AttributeName: userId
            KeyType: HASH
```

#### Step 3: Create Lambda Handlers

Create handler functions that replace Express routes:

```typescript
// src/handlers/health.ts
import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      status: 'OK',
      timestamp: new Date().toISOString(),
    }),
  };
};
```

```typescript
// src/handlers/auth.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const USERS_TABLE = `${process.env.DYNAMODB_TABLE}-users`;

// Register handler
export const register: APIGatewayProxyHandler = async (event) => {
  try {
    const { email, password, firstName, lastName } = JSON.parse(event.body || '{}');

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Check if user exists
    const existingUser = await docClient.send(new QueryCommand({
      TableName: USERS_TABLE,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    }));

    if (existingUser.Items && existingUser.Items.length > 0) {
      return {
        statusCode: 409,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'User already exists' }),
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = uuidv4();
    const now = new Date().toISOString();

    await docClient.send(new PutCommand({
      TableName: USERS_TABLE,
      Item: {
        id: userId,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        createdAt: now,
        updatedAt: now,
      },
    }));

    // Generate JWT
    const token = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'User registered successfully',
        user: { id: userId, email, firstName, lastName },
        token,
      }),
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// Login handler
export const login: APIGatewayProxyHandler = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body || '{}');

    if (!email || !password) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Email and password required' }),
      };
    }

    // Find user
    const result = await docClient.send(new QueryCommand({
      TableName: USERS_TABLE,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    }));

    if (!result.Items || result.Items.length === 0) {
      return {
        statusCode: 401,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }

    const user = result.Items[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return {
        statusCode: 401,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token,
      }),
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// Verify token handler
export const verifyToken: APIGatewayProxyHandler = async (event) => {
  try {
    const token = event.headers.Authorization?.replace('Bearer ', '');

    if (!token) {
      return {
        statusCode: 401,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'No token provided' }),
      };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        valid: true,
        userId: decoded.userId,
        email: decoded.email,
      }),
    };
  } catch (error) {
    return {
      statusCode: 401,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Invalid token' }),
    };
  }
};
```

```typescript
// src/handlers/character.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import jwt from 'jsonwebtoken';

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const CHARACTERS_TABLE = `${process.env.DYNAMODB_TABLE}-characters`;

// Helper to extract userId from token
const getUserIdFromToken = (event: any): string | null => {
  try {
    const token = event.headers.Authorization?.replace('Bearer ', '');
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return decoded.userId;
  } catch {
    return null;
  }
};

// Save character state
export const save: APIGatewayProxyHandler = async (event) => {
  try {
    const userId = getUserIdFromToken(event);
    if (!userId) {
      return {
        statusCode: 401,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    const characterState = JSON.parse(event.body || '{}');

    await docClient.send(new PutCommand({
      TableName: CHARACTERS_TABLE,
      Item: {
        userId,
        ...characterState,
        savedAt: new Date().toISOString(),
      },
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Character saved successfully' }),
    };
  } catch (error) {
    console.error('Save error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to save character' }),
    };
  }
};

// Load character state
export const load: APIGatewayProxyHandler = async (event) => {
  try {
    const userId = getUserIdFromToken(event);
    if (!userId) {
      return {
        statusCode: 401,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    const result = await docClient.send(new GetCommand({
      TableName: CHARACTERS_TABLE,
      Key: { userId },
    }));

    if (!result.Item) {
      return {
        statusCode: 404,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'No saved character found' }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error('Load error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to load character' }),
    };
  }
};

// Delete character state
export const deleteCharacter: APIGatewayProxyHandler = async (event) => {
  try {
    const userId = getUserIdFromToken(event);
    if (!userId) {
      return {
        statusCode: 401,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    await docClient.send(new DeleteCommand({
      TableName: CHARACTERS_TABLE,
      Key: { userId },
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Character deleted successfully' }),
    };
  } catch (error) {
    console.error('Delete error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to delete character' }),
    };
  }
};
```

#### Step 4: Install Dependencies

```bash
# In axiomancer-serverless directory
npm install --save \
  @aws-sdk/client-dynamodb \
  @aws-sdk/lib-dynamodb \
  bcryptjs \
  jsonwebtoken \
  uuid

npm install --save-dev \
  @types/aws-lambda \
  @types/bcryptjs \
  @types/jsonwebtoken \
  @types/uuid \
  typescript \
  esbuild
```

#### Step 5: Create TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### Step 6: Update package.json

```json
{
  "name": "axiomancer-serverless",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc",
    "deploy": "npm run build && serverless deploy",
    "deploy:prod": "npm run build && serverless deploy --stage prod",
    "remove": "serverless remove",
    "logs": "serverless logs -f",
    "offline": "serverless offline"
  }
}
```

#### Step 7: Deploy Serverless Backend

```bash
# Create .env file
cat > .env << EOF
JWT_SECRET=$(openssl rand -base64 32)
EOF

# Deploy to AWS
npm run deploy

# Or for specific stage
npm run deploy:prod

# You'll get output like:
# Service Information
# service: axiomancer-api
# stage: prod
# region: us-east-1
# stack: axiomancer-api-prod
# endpoints:
#   GET - https://abc123.execute-api.us-east-1.amazonaws.com/prod/health
#   POST - https://abc123.execute-api.us-east-1.amazonaws.com/prod/api/auth/register
#   ...
```

Save your API Gateway endpoint URL!

### Option B: Using Aurora Serverless v2 (PostgreSQL)

If you want to keep PostgreSQL instead of DynamoDB:

```yaml
# Add to serverless.yml resources section
AuroraCluster:
  Type: AWS::RDS::DBCluster
  Properties:
    Engine: aurora-postgresql
    EngineMode: provisioned
    EngineVersion: '15.3'
    DatabaseName: axiomancer
    MasterUsername: axiomancer
    MasterUserPassword: ${env:DB_PASSWORD}
    ServerlessV2ScalingConfiguration:
      MinCapacity: 0.5  # Minimum 0.5 ACUs (Aurora Capacity Units)
      MaxCapacity: 1    # Maximum 1 ACU (very cost-effective)
    VpcSecurityGroupIds:
      - !Ref AuroraSecurityGroup
    DBSubnetGroupName: !Ref DBSubnetGroup

AuroraInstance:
  Type: AWS::RDS::DBInstance
  Properties:
    Engine: aurora-postgresql
    DBInstanceClass: db.serverless
    DBClusterIdentifier: !Ref AuroraCluster
```

Cost: ~$45/month minimum (0.5 ACU * $0.12/hour * 730 hours)

### Frontend Deployment (Same as Traditional)

The frontend deployment is identical:

```bash
# Build frontend
cd axiomancer-frontend

# Update API endpoint to Lambda API Gateway URL
# Edit .env.production or src/config
echo "VITE_API_URL=https://abc123.execute-api.us-east-1.amazonaws.com/prod" > .env.production

npm run build

# Create S3 bucket
BUCKET_NAME="axiomancer-frontend-$(date +%s)"
aws s3 mb s3://$BUCKET_NAME
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Upload files
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete

# Make public (for CloudFront)
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy "{
  \"Version\": \"2012-10-17\",
  \"Statement\": [{
    \"Sid\": \"PublicReadGetObject\",
    \"Effect\": \"Allow\",
    \"Principal\": \"*\",
    \"Action\": \"s3:GetObject\",
    \"Resource\": \"arn:aws:s3:::${BUCKET_NAME}/*\"
  }]
}"

# Create CloudFront distribution (same as traditional deployment)
```

### Monitoring Serverless

```bash
# View Lambda logs
serverless logs -f register -t

# AWS CloudWatch
aws logs tail /aws/lambda/axiomancer-api-prod-register --follow

# Metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=axiomancer-api-prod-register \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Sum
```

### Cost Optimization Tips

1. **Lambda**:
   - Use ARM64 architecture (20% cheaper)
   - Optimize memory allocation (lower = cheaper but slower)
   - Use Lambda Provisioned Concurrency only if needed

2. **DynamoDB**:
   - Use on-demand billing for unpredictable traffic
   - Use provisioned capacity for consistent traffic (cheaper)
   - Enable point-in-time recovery for backups

3. **S3 + CloudFront**:
   - Enable compression
   - Use S3 Intelligent-Tiering for storage
   - Set appropriate cache headers

4. **API Gateway**:
   - Use HTTP API instead of REST API (70% cheaper)
   - Enable caching for frequently accessed endpoints

### Comparison: Traditional vs Serverless

| Aspect | Traditional (EC2 + RDS) | Serverless (Lambda + DynamoDB) |
|--------|-------------------------|--------------------------------|
| **Cost** | $50-70/month | $5-15/month |
| **Scaling** | Manual (can use auto-scaling) | Automatic |
| **Maintenance** | Server updates, patches | None |
| **Cold Starts** | None | 1-3 seconds |
| **Database** | PostgreSQL (familiar) | DynamoDB (NoSQL learning curve) |
| **Docker** | Required | Not needed |
| **Complexity** | Lower (traditional stack) | Higher (distributed architecture) |
| **Best For** | Consistent traffic, complex queries | Variable traffic, simple queries |

### Hybrid Approach

You can also use a hybrid approach:
- **Frontend**: S3 + CloudFront (always)
- **Backend**: Lambda functions
- **Database**: Aurora Serverless v2 (PostgreSQL) - keeps your existing database code!

This gives you serverless benefits while keeping PostgreSQL:

```yaml
# serverless.yml with Aurora Serverless v2
provider:
  environment:
    DB_HOST: !GetAtt AuroraCluster.Endpoint.Address
    DB_PORT: 5432
    DB_NAME: axiomancer
    DB_USER: axiomancer
    DB_PASSWORD: ${env:DB_PASSWORD}
    NODE_ENV: production
```

Your existing backend code would work with minimal changes!

---

## Conclusion

You now have two deployment options:

### Traditional Deployment
- **Cost**: ~$50-70/month
- **Complexity**: Medium
- **Performance**: Consistent, no cold starts
- **Best for**: Production apps with consistent traffic

### Serverless Deployment  
- **Cost**: ~$5-15/month
- **Complexity**: Higher
- **Performance**: Auto-scaling, some cold starts
- **Best for**: MVPs, variable traffic, cost optimization

### Recommended Path
1. **Start with traditional** for simplicity and learning
2. **Monitor costs and traffic** for 1-2 months
3. **Migrate to serverless** if traffic is low/variable and you want to optimize costs

Both approaches are production-ready. Choose based on your priorities: cost, simplicity, or performance.

### Support Resources
- [AWS Free Tier](https://aws.amazon.com/free/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [Serverless Framework Docs](https://www.serverless.com/framework/docs)
- [AWS Lambda Pricing Calculator](https://aws.amazon.com/lambda/pricing/)

Good luck with your deployment! 🚀
