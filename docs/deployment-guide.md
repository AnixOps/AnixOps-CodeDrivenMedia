# 部署指南

> 从开发到生产的完整部署方案

## 🎯 部署策略概览

### 部署环境分层

```
开发环境 (Development)
├── 本地开发调试
├── 实时预览验证
└── 快速迭代测试
    ↓
测试环境 (Staging)  
├── 集成测试验证
├── 性能基准测试
└── 客户预览确认
    ↓
生产环境 (Production)
├── 高质量视频渲染
├── 批量处理任务
└── 正式内容交付
```

### 部署架构图

```
┌─────────────────────────────────────────┐
│              CDN Layer                   │
│        (静态资源分发)                    │
├─────────────────────────────────────────┤
│              Load Balancer               │
│           (负载均衡器)                   │
├─────────────────────────────────────────┤
│    Application Layer (应用层)            │
│  ┌─────────────┐  ┌─────────────┐      │
│  │  Web UI     │  │  API Server │      │
│  │  (管理界面) │  │  (接口服务) │      │
│  └─────────────┘  └─────────────┘      │
├─────────────────────────────────────────┤
│         Render Farm (渲染农场)           │
│  ┌─────────────┐  ┌─────────────┐      │
│  │  Worker 1   │  │  Worker 2   │      │
│  │  (渲染节点) │  │  (渲染节点) │      │
│  └─────────────┘  └─────────────┘      │
├─────────────────────────────────────────┤
│           Storage Layer                  │
│  ┌─────────────┐  ┌─────────────┐      │
│  │  Asset      │  │  Output     │      │
│  │  Storage    │  │  Storage    │      │
│  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────┘
```

## 🏗️ 本地开发环境

### 1. 环境要求

#### 系统要求
```bash
操作系统: Windows 10+ / macOS 10.15+ / Ubuntu 18.04+
CPU: Intel i5 8代+ / AMD Ryzen 5 3600+
内存: 16GB RAM (推荐 32GB)
存储: 100GB+ 可用空间 (SSD推荐)
显卡: 支持硬件加速 (可选但推荐)
```

#### 软件依赖
```bash
Node.js: 18.x LTS
npm: 8.x+
Git: 2.30+
FFmpeg: 4.4+ (用于视频处理)
Chrome: 最新版本 (Remotion依赖)
```

### 2. 快速启动

#### 项目初始化
```bash
# 克隆项目
git clone https://github.com/AnixOps/AnixOps-CodeDrivenMedia.git
cd AnixOps-CodeDrivenMedia

# 安装依赖
npm install

# 环境配置
cp .env.example .env.local
# 编辑 .env.local 配置本地参数

# 启动开发服务器
npm run dev
```

#### 开发服务器配置
```typescript
// remotion.config.ts - 开发环境配置
import { Config } from 'remotion';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setPixelFormat('yuv420p');

// 开发环境优化
if (process.env.NODE_ENV === 'development') {
  Config.setQuality(50);           // 降低质量提升预览速度
  Config.setCrf(28);               // 更高压缩比
  Config.setScale(0.5);            // 缩小尺寸
  Config.setNumberOfGifLoops(0);   // 禁用GIF循环
}
```

### 3. 开发工作流

#### Hot Reload 优化
```json
// package.json
{
  "scripts": {
    "dev": "remotion studio src/index.ts --port=3000",
    "dev:fast": "remotion studio src/index.ts --port=3000 --webpack-poll",
    "preview": "remotion preview src/index.ts --port=3001"
  }
}
```

#### 实时预览配置
```typescript
// scripts/dev-server.ts
import { createServer } from 'remotion';

const server = createServer({
  // 快速重载
  webpackOverride: (config) => {
    config.watchOptions = {
      poll: 1000,               // 1秒轮询
      aggregateTimeout: 300,    // 300ms 聚合
      ignored: [
        '**/node_modules/**',
        '**/output/**',
        '**/.git/**'
      ]
    };
    return config;
  },
  
  // 开发辅助
  studio: {
    puppeteerTimeout: 10000,    // Puppeteer超时
    enableMultiprocessOnLinux: false
  }
});

server.listen(3000);
```

## 🧪 测试环境部署

### 1. Docker 容器化

#### Dockerfile
```dockerfile
# 多阶段构建 - 开发基础镜像
FROM node:18-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# 开发依赖阶段
FROM base AS dev-deps
RUN npm ci

# 构建阶段
FROM dev-deps AS build
COPY . .
RUN npm run build

# 运行时镜像
FROM node:18-alpine AS runtime

# 安装系统依赖
RUN apk add --no-cache \
    chromium \
    ffmpeg \
    dumb-init

# 设置 Chromium 路径
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./

EXPOSE 3000

USER node
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
```

#### Docker Compose 配置
```yaml
# docker-compose.yml
version: '3.8'

services:
  # Web 应用
  web:
    build: 
      context: .
      target: runtime
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=staging
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./assets:/app/assets:ro
      - ./output:/app/output
    depends_on:
      - redis
      - postgres
    
  # Redis 缓存
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    
  # PostgreSQL 数据库  
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: anixops_media
      POSTGRES_USER: developer
      POSTGRES_PASSWORD: dev_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
  
  # 渲染队列处理器
  render-worker:
    build:
      context: .
      target: runtime
    command: npm run worker
    environment:
      - NODE_ENV=staging
      - REDIS_URL=redis://redis:6379
      - WORKER_CONCURRENCY=2
    volumes:
      - ./assets:/app/assets:ro
      - ./output:/app/output
    depends_on:
      - redis
    deploy:
      replicas: 3

volumes:
  redis_data:
  postgres_data:
```

### 2. CI/CD 管道

#### GitHub Actions 工作流
```yaml
# .github/workflows/deploy.yml
name: Deploy to Staging

on:
  push:
    branches: [develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run unit tests
      run: npm run test:unit
    
    - name: Run integration tests
      run: npm run test:integration
      env:
        REDIS_URL: redis://localhost:6379
    
    - name: Test render pipeline
      run: npm run test:render
      timeout-minutes: 10
  
  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: |
          ghcr.io/anixops/codedrivenmedia:${{ github.sha }}
          ghcr.io/anixops/codedrivenmedia:latest
        cache-from: type=gha
        cache-to: type=gha,mode=max
  
  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
    - name: Deploy to staging
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.STAGING_HOST }}
        username: ${{ secrets.STAGING_USER }}
        key: ${{ secrets.STAGING_SSH_KEY }}
        script: |
          cd /opt/anixops-media
          docker-compose pull
          docker-compose up -d --force-recreate
          docker system prune -f
```

### 3. 监控与告警

#### Prometheus + Grafana 配置
```yaml
# monitoring/docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
  
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/dashboards:/var/lib/grafana/dashboards
      - ./grafana/provisioning:/etc/grafana/provisioning
  
  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'

volumes:
  prometheus_data:
  grafana_data:
```

## 🚀 生产环境部署

### 1. 云基础设施

#### AWS 架构部署
```yaml
# infrastructure/aws/main.tf (Terraform)
provider "aws" {
  region = var.aws_region
}

# VPC 网络
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "anixops-media-vpc"
  }
}

# 公共子网
resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
  
  map_public_ip_on_launch = true
  
  tags = {
    Name = "anixops-media-public-${count.index + 1}"
  }
}

# 私有子网
resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
  
  tags = {
    Name = "anixops-media-private-${count.index + 1}"
  }
}

# ECS 集群
resource "aws_ecs_cluster" "main" {
  name = "anixops-media"
  
  capacity_providers = ["FARGATE", "FARGATE_SPOT"]
  
  default_capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight           = 1
  }
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# 应用负载均衡器
resource "aws_lb" "main" {
  name               = "anixops-media-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets           = aws_subnet.public[*].id
  
  enable_deletion_protection = false
}

# RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier     = "anixops-media-db"
  engine         = "postgres"
  engine_version = "15.3"
  instance_class = "db.t3.micro"
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_encrypted     = true
  
  db_name  = "anixops_media"
  username = "dbadmin"
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = true
}

# ElastiCache Redis
resource "aws_elasticache_subnet_group" "main" {
  name       = "anixops-media-cache-subnet"
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "anixops-media-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [aws_security_group.redis.id]
}

# S3 存储桶
resource "aws_s3_bucket" "assets" {
  bucket = "anixops-media-assets-${random_id.bucket_suffix.hex}"
}

resource "aws_s3_bucket" "output" {
  bucket = "anixops-media-output-${random_id.bucket_suffix.hex}"
}

# CloudFront CDN
resource "aws_cloudfront_distribution" "main" {
  origin {
    domain_name = aws_s3_bucket.assets.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.assets.id}"
    
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
    }
  }
  
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "AnixOps Media CDN"
  default_root_object = "index.html"
  
  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.assets.id}"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
```

### 2. Kubernetes 部署

#### K8s 部署配置
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: anixops-media
  labels:
    name: anixops-media

---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: anixops-media-config
  namespace: anixops-media
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  RENDER_QUALITY: "high"
  RENDER_CONCURRENCY: "4"

---
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: anixops-media-secrets
  namespace: anixops-media
type: Opaque
stringData:
  DATABASE_URL: "postgresql://user:password@postgres:5432/anixops_media"
  REDIS_URL: "redis://redis:6379"
  JWT_SECRET: "your-jwt-secret"
  AWS_ACCESS_KEY_ID: "your-access-key"
  AWS_SECRET_ACCESS_KEY: "your-secret-key"

---
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: anixops-media-web
  namespace: anixops-media
  labels:
    app: anixops-media-web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: anixops-media-web
  template:
    metadata:
      labels:
        app: anixops-media-web
    spec:
      containers:
      - name: web
        image: ghcr.io/anixops/codedrivenmedia:latest
        ports:
        - containerPort: 3000
        env:
        - name: PORT
          value: "3000"
        envFrom:
        - configMapRef:
            name: anixops-media-config
        - secretRef:
            name: anixops-media-secrets
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi" 
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
# k8s/render-worker.yaml  
apiVersion: apps/v1
kind: Deployment
metadata:
  name: anixops-media-worker
  namespace: anixops-media
  labels:
    app: anixops-media-worker
spec:
  replicas: 5
  selector:
    matchLabels:
      app: anixops-media-worker
  template:
    metadata:
      labels:
        app: anixops-media-worker
    spec:
      containers:
      - name: worker
        image: ghcr.io/anixops/codedrivenmedia:latest
        command: ["npm", "run", "worker"]
        envFrom:
        - configMapRef:
            name: anixops-media-config
        - secretRef:
            name: anixops-media-secrets
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        volumeMounts:
        - name: temp-storage
          mountPath: /tmp
      volumes:
      - name: temp-storage
        emptyDir:
          sizeLimit: "10Gi"

---
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: anixops-media-service
  namespace: anixops-media
spec:
  selector:
    app: anixops-media-web
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP

---
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: anixops-media-ingress
  namespace: anixops-media
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - media.anixops.com
    secretName: anixops-media-tls
  rules:
  - host: media.anixops.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: anixops-media-service
            port:
              number: 80

---
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: anixops-media-hpa
  namespace: anixops-media
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: anixops-media-web
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### 3. 渲染农场部署

#### 分布式渲染配置
```typescript
// infrastructure/render-farm/render-farm.ts
export class RenderFarm {
  private workers: Map<string, RenderWorker> = new Map();
  private jobQueue: JobQueue;
  
  constructor(
    private config: RenderFarmConfig,
    private redis: Redis
  ) {
    this.jobQueue = new JobQueue(redis);
    this.initializeWorkers();
  }
  
  private async initializeWorkers(): Promise<void> {
    const workerConfigs = await this.discoverWorkers();
    
    for (const config of workerConfigs) {
      const worker = new RenderWorker(config);
      await worker.initialize();
      
      this.workers.set(worker.id, worker);
      
      // 健康检查
      setInterval(() => {
        this.healthCheckWorker(worker);
      }, 30000);
    }
  }
  
  async submitJob(job: RenderJob): Promise<string> {
    // 估算任务复杂度
    const complexity = this.estimateComplexity(job);
    
    // 选择最适合的worker
    const worker = await this.selectWorker(complexity);
    
    if (!worker) {
      // 加入队列等待
      return this.jobQueue.enqueue(job);
    }
    
    // 直接分配任务
    return worker.execute(job);
  }
  
  private async selectWorker(
    complexity: JobComplexity
  ): Promise<RenderWorker | null> {
    const availableWorkers = Array.from(this.workers.values())
      .filter(worker => worker.isAvailable())
      .sort((a, b) => this.scoreWorker(b, complexity) - this.scoreWorker(a, complexity));
    
    return availableWorkers[0] || null;
  }
  
  private scoreWorker(
    worker: RenderWorker,
    complexity: JobComplexity
  ): number {
    let score = 0;
    
    // CPU能力评分
    score += (worker.capabilities.cpu / complexity.cpuRequirement) * 40;
    
    // 内存可用性评分
    score += (worker.capabilities.memory / complexity.memoryRequirement) * 30;
    
    // 当前负载评分 (负载越低分数越高)
    score += (1 - worker.getCurrentLoad()) * 20;
    
    // 地理位置评分 (延迟越低分数越高)  
    score += Math.max(0, 10 - worker.latency / 10) * 10;
    
    return score;
  }
}

// 渲染工作节点
export class RenderWorker {
  private docker: Docker;
  private currentJobs: Set<string> = new Set();
  
  constructor(
    public id: string,
    public capabilities: WorkerCapabilities,
    private config: WorkerConfig
  ) {
    this.docker = new Docker();
  }
  
  async execute(job: RenderJob): Promise<string> {
    const jobId = generateJobId();
    this.currentJobs.add(jobId);
    
    try {
      // 创建隔离的渲染容器
      const container = await this.docker.createContainer({
        Image: 'anixops/render-worker:latest',
        Env: [
          `JOB_ID=${jobId}`,
          `COMPOSITION=${job.composition}`,
          `OUTPUT_FORMAT=${job.outputFormat}`,
          `QUALITY=${job.quality}`
        ],
        WorkingDir: '/app',
        HostConfig: {
          Memory: job.memoryLimit || 2 * 1024 * 1024 * 1024, // 2GB
          CpuQuota: job.cpuLimit || 100000, // 1 CPU
          AutoRemove: true
        },
        Volumes: {
          '/tmp/render': {}
        }
      });
      
      await container.start();
      
      // 监控渲染进度
      const stream = await container.logs({
        follow: true,
        stdout: true,
        stderr: true
      });
      
      return new Promise((resolve, reject) => {
        container.wait((err, data) => {
          this.currentJobs.delete(jobId);
          
          if (err || data.StatusCode !== 0) {
            reject(new Error(`Render failed: ${err?.message || 'Unknown error'}`));
          } else {
            resolve(jobId);
          }
        });
      });
      
    } catch (error) {
      this.currentJobs.delete(jobId);
      throw error;
    }
  }
  
  isAvailable(): boolean {
    const maxConcurrentJobs = this.capabilities.cpu; // 每CPU核心一个任务
    return this.currentJobs.size < maxConcurrentJobs;
  }
  
  getCurrentLoad(): number {
    const maxJobs = this.capabilities.cpu;
    return this.currentJobs.size / maxJobs;
  }
}
```

## 📊 性能优化部署

### 1. 缓存策略

#### Redis 集群配置
```yaml
# redis-cluster/docker-compose.yml
version: '3.8'

services:
  redis-node-1:
    image: redis:7-alpine
    command: redis-server /etc/redis/redis.conf
    ports:
      - "7001:6379"
    volumes:
      - ./redis-node-1.conf:/etc/redis/redis.conf
      - redis-node-1-data:/data
    
  redis-node-2:
    image: redis:7-alpine
    command: redis-server /etc/redis/redis.conf
    ports:
      - "7002:6379"
    volumes:
      - ./redis-node-2.conf:/etc/redis/redis.conf
      - redis-node-2-data:/data
    
  redis-node-3:
    image: redis:7-alpine
    command: redis-server /etc/redis/redis.conf
    ports:
      - "7003:6379"
    volumes:
      - ./redis-node-3.conf:/etc/redis/redis.conf
      - redis-node-3-data:/data

volumes:
  redis-node-1-data:
  redis-node-2-data:
  redis-node-3-data:
```

#### 缓存策略实现
```typescript
// services/cache.service.ts
export class CacheService {
  private redis: Redis.Cluster;
  
  constructor() {
    this.redis = new Redis.Cluster([
      { host: 'redis-node-1', port: 6379 },
      { host: 'redis-node-2', port: 6379 },
      { host: 'redis-node-3', port: 6379 }
    ]);
  }
  
  // 渲染结果缓存
  async cacheRenderResult(
    compositionHash: string,
    result: RenderResult,
    ttl = 3600 * 24 * 7 // 7天
  ): Promise<void> {
    const key = `render:${compositionHash}`;
    await this.redis.setex(key, ttl, JSON.stringify(result));
  }
  
  async getCachedRender(compositionHash: string): Promise<RenderResult | null> {
    const key = `render:${compositionHash}`;
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }
  
  // 资源缓存
  async cacheAsset(
    assetPath: string,
    data: Buffer,
    ttl = 3600 * 24 * 30 // 30天
  ): Promise<void> {
    const key = `asset:${assetPath}`;
    await this.redis.setex(key, ttl, data);
  }
  
  // 预热缓存
  async warmupCache(compositions: string[]): Promise<void> {
    const pipeline = this.redis.pipeline();
    
    for (const composition of compositions) {
      // 预渲染低质量版本用于快速预览
      const previewJob = {
        composition,
        quality: 'low',
        format: 'webm',
        scale: 0.5
      };
      
      pipeline.lpush('render:queue:preview', JSON.stringify(previewJob));
    }
    
    await pipeline.exec();
  }
}
```

### 2. CDN 配置优化

#### CloudFlare Workers 配置
```typescript
// cloudflare-workers/cache-optimizer.ts
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const cacheKey = new Request(url.toString(), request);
    const cache = caches.default;
    
    // 检查缓存
    let response = await cache.match(cacheKey);
    if (response) {
      return response;
    }
    
    // 从源服务器获取
    response = await fetch(request);
    
    // 设置缓存策略
    const cacheResponse = new Response(response.body, response);
    
    if (url.pathname.endsWith('.mp4') || url.pathname.endsWith('.webm')) {
      // 视频文件长期缓存
      cacheResponse.headers.set('Cache-Control', 'public, max-age=31536000');
      cacheResponse.headers.set('CDN-Cache-Control', 'max-age=31536000');
    } else if (url.pathname.includes('/assets/')) {
      // 静态资源缓存
      cacheResponse.headers.set('Cache-Control', 'public, max-age=86400');
    }
    
    // 添加 CORS 头
    cacheResponse.headers.set('Access-Control-Allow-Origin', '*');
    cacheResponse.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    
    // 存储到边缘缓存
    ctx.waitUntil(cache.put(cacheKey, cacheResponse.clone()));
    
    return cacheResponse;
  }
};
```

## 🔐 安全配置

### 1. 网络安全

#### 防火墙配置
```bash
#!/bin/bash
# scripts/setup-firewall.sh

# 基础防火墙规则
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# SSH访问 (限制IP)
ufw allow from 192.168.1.0/24 to any port 22

# HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# 内部服务通信
ufw allow from 10.0.0.0/16 to any port 5432  # PostgreSQL
ufw allow from 10.0.0.0/16 to any port 6379  # Redis
ufw allow from 10.0.0.0/16 to any port 3000  # Application

# 监控服务
ufw allow from 10.0.0.0/16 to any port 9090  # Prometheus
ufw allow from 10.0.0.0/16 to any port 3001  # Grafana

# 启用防火墙
ufw --force enable

# 显示状态
ufw status verbose
```

### 2. 应用安全

#### Helmet.js 安全配置
```typescript
// security/helmet.config.ts
import helmet from 'helmet';

export const securityConfig = helmet({
  // 内容安全策略
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://cdn.anixops.com"],
      scriptSrc: ["'self'"],
      mediaSrc: ["'self'", "https://cdn.anixops.com"],
      connectSrc: ["'self'", "https://api.anixops.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"]
    }
  },
  
  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  
  // 其他安全头
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: 'same-origin' }
});

// 速率限制
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 100个请求
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false
};
```

### 3. 数据保护

#### 备份策略
```bash
#!/bin/bash
# scripts/backup.sh

# 配置
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# 数据库备份
pg_dump -h localhost -U dbadmin anixops_media > "$BACKUP_DIR/database_$DATE.sql"

# Redis 备份
redis-cli --rdb "$BACKUP_DIR/redis_$DATE.rdb"

# 资源文件备份
tar -czf "$BACKUP_DIR/assets_$DATE.tar.gz" /opt/anixops-media/assets

# 上传到 S3
aws s3 cp "$BACKUP_DIR/" s3://anixops-backups/daily/ --recursive --exclude "*" --include "*$DATE*"

# 清理本地旧备份
find "$BACKUP_DIR" -name "*.sql" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.rdb" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $DATE"
```

## 📋 部署检查清单

### ✅ 环境准备
- [ ] 系统要求验证
- [ ] 依赖软件安装
- [ ] 网络配置检查
- [ ] 安全策略配置

### ✅ 应用部署
- [ ] 代码构建成功
- [ ] 容器镜像创建
- [ ] 配置文件部署
- [ ] 环境变量设置

### ✅ 服务配置
- [ ] 数据库连接测试
- [ ] Redis 集群配置
- [ ] 负载均衡器配置
- [ ] CDN 缓存策略

### ✅ 监控告警
- [ ] 应用监控配置
- [ ] 性能指标收集
- [ ] 告警规则设置
- [ ] 日志聚合配置

### ✅ 安全验证
- [ ] SSL 证书配置
- [ ] 防火墙规则验证
- [ ] 访问控制测试
- [ ] 备份恢复测试

通过这套完整的部署指南，可以实现：
- 🚀 **零停机部署**
- 📊 **实时监控**
- 🔒 **企业级安全**
- ⚡ **高性能缓存**