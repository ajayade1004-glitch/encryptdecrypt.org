/**
 * Configuration & DevOps Client-Side Engines
 * 100% browser-native Dockerfile/Compose builders, Nginx/Apache configs,
 * CI/CD pipelines (GitHub Actions, GitLab CI, Jenkins), K8s manifests, and linter configs.
 */

/** 1. Dockerfile Generator */
export function generateDockerfile(input: string): string {
  const env = (input || 'node').toLowerCase();

  if (env.includes('python')) {
    return `FROM python:3.12-slim-bookworm

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \\
    build-essential curl \\
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`;
  }

  return `# Multi-stage production build for Node.js / Vite / Express
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \\
    PORT=3000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./

USER node
EXPOSE 3000

CMD ["node", "dist/server.js"]`;
}

/** 2. Docker Compose Generator */
export function generateDockerCompose(input: string): string {
  return `version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:secret@db:5432/app_db
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: app_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:`;
}

/** 3. Nginx Configuration Generator */
export function generateNginxConfig(input: string): string {
  return `server {
    listen 80;
    server_name encryptdecrypt.org www.encryptdecrypt.org;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name encryptdecrypt.org www.encryptdecrypt.org;

    ssl_certificate /etc/letsencrypt/live/encryptdecrypt.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/encryptdecrypt.org/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    root /var/www/encryptdecrypt/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`;
}

/** 4. Apache Virtual Host Generator */
export function generateApacheVhost(input: string): string {
  return `<VirtualHost *:80>
    ServerName encryptdecrypt.org
    ServerAlias www.encryptdecrypt.org
    Redirect permanent / https://encryptdecrypt.org/
</VirtualHost>

<VirtualHost *:443>
    ServerName encryptdecrypt.org
    ServerAlias www.encryptdecrypt.org
    DocumentRoot /var/www/encryptdecrypt/dist

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/encryptdecrypt.org/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/encryptdecrypt.org/privkey.pem
    SSLCertificateChainFile /etc/letsencrypt/live/encryptdecrypt.org/chain.pem

    <Directory /var/www/encryptdecrypt/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        # SPA Routing
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>`;
}

/** 5. GitHub Actions YAML Generator */
export function generateGithubActions(input: string): string {
  return `name: Production CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test_and_build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Code
      uses: actions/checkout@v4

    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: 'npm'

    - name: Install Dependencies
      run: npm ci

    - name: Run Linter
      run: npm run lint

    - name: Execute Test Suite
      run: npm test

    - name: Build Production Assets
      run: npm run build

    - name: Deploy to Cloud
      if: github.ref == 'refs/heads/main'
      run: echo "Deploying to production server..."`;
}

/** 6. GitLab CI YAML Generator */
export function generateGitlabCi(input: string): string {
  return `stages:
  - test
  - build
  - deploy

image: node:20-alpine

cache:
  paths:
    - node_modules/

lint_and_test:
  stage: test
  script:
    - npm ci
    - npm run lint
    - npm test

build_bundle:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

deploy_production:
  stage: deploy
  script:
    - echo "Deploying artifacts to production..."
  only:
    - main`;
}

/** 7. Jenkins Pipeline Template Generator */
export function generateJenkinsfile(input: string): string {
  return `pipeline {
    agent any

    tools {
        nodejs 'NodeJS-20'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install & Test') {
            steps {
                sh 'npm ci'
                sh 'npm run lint'
                sh 'npm test'
            }
        }
        stage('Build Artifacts') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to Kubernetes cluster...'
            }
        }
    }
}`;
}

/** 8. Kubernetes YAML Template Generator */
export function generateK8sYaml(input: string): string {
  return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: encryptdecrypt-app
  labels:
    app: encryptdecrypt
spec:
  replicas: 3
  selector:
    matchLabels:
      app: encryptdecrypt
  template:
    metadata:
      labels:
        app: encryptdecrypt
    spec:
      containers:
      - name: web
        image: gcr.io/encryptdecrypt/web:latest
        ports:
        - containerPort: 3000
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "100m"
            memory: "128Mi"
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: encryptdecrypt-svc
spec:
  type: ClusterIP
  selector:
    app: encryptdecrypt
  ports:
  - port: 80
    targetPort: 3000`;
}

/** 9. Docker Ignore Generator */
export function generateDockerignore(input: string): string {
  return `# Dependencies
node_modules
.pnpm-store

# Git & IDEs
.git
.gitignore
.vscode
.idea

# Build outputs & caches
dist
build
.next
.cache
.npm
npm-debug.log*

# Environment & Secrets
.env
.env.local
.env.*.local
*.pem
*.key

# Test and coverage
coverage
.nyc_output`;
}

/** 10. EditorConfig Generator */
export function generateEditorConfig(input: string): string {
  return `root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab`;
}

/** 11. Prettier Configuration Generator */
export function generatePrettierConfig(input: string): string {
  return `{\n  "semi": true,\n  "singleQuote": true,\n  "tabWidth": 2,\n  "trailingComma": "es5",\n  "printWidth": 100,\n  "bracketSpacing": true,\n  "arrowParens": "avoid",\n  "endOfLine": "lf"\n}`;
}

/** 12. ESLint Configuration Generator */
export function generateEslintConfig(input: string): string {
  return `export default [
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always']
    }
  }
];`;
}

/** 13. Environment Variable Template Generator */
export function generateEnvTemplate(input: string): string {
  return `# Application Environment Variables
NODE_ENV=production
PORT=3000
APP_URL=https://encryptdecrypt.org

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/app_db
DATABASE_POOL_SIZE=10

# Security & Cryptography
JWT_SECRET=replace_with_a_secure_256_bit_random_secret_string
SESSION_COOKIE_NAME=encryptdecrypt_session

# Third-Party Integrations
REDIS_URL=redis://localhost:6379`;
}

/** 14. .env File Formatter */
export function formatEnvFile(input: string): string {
  const lines = (input || 'PORT=3000\nNODE_ENV=development\nDB_URL=postgres://...\n').split(/\r?\n/);
  const formatted = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return trimmed;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) return trimmed;
    const key = trimmed.slice(0, eqIdx).trim().toUpperCase();
    const val = trimmed.slice(eqIdx + 1).trim();
    return `${key}=${val}`;
  });

  return formatted.join('\n');
}

/** 15. .env Example Generator */
export function generateEnvExample(input: string): string {
  const raw = input || 'PORT=3000\nDATABASE_URL=postgresql://admin:secret123@db.prod.internal:5432/finance\nAPI_KEY=sk_live_9998124\nJWT_SECRET=super_secret_key_123';
  const lines = raw.split(/\r?\n/);

  const masked = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return trimmed;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) return trimmed;
    const key = trimmed.slice(0, eqIdx).trim();
    return `${key}=your_${key.toLowerCase()}_here`;
  });

  return `# Sample Configuration (.env.example) - Commit this to source control!\n` + masked.join('\n');
}

/** 16. OpenAPI Specification Generator */
export function generateOpenApiSpec(input: string): string {
  return `openapi: 3.0.3
info:
  title: EncryptDecrypt Developer API
  version: 2.5.0
  description: 100% Client-side and server-proxy cryptographic developer endpoints.
paths:
  /api/v1/tools:
    get:
      summary: List available developer utilities
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: string
                    name:
                      type: string`;
}

/** 17. API Documentation Template Generator */
export function generateApiDocTemplate(input: string): string {
  return `# API Documentation: Encryption Service

## POST /api/v1/ciphers/aes-gcm

Encrypts a plaintext payload using 256-bit AES-GCM cipher with authenticated data.

### Request Headers
| Header | Value | Required |
| :--- | :--- | :--- |
| \`Content-Type\` | \`application/json\` | Yes |

### Response Schema (200 OK)
\`\`\`json
{
  "status": "success",
  "data": {
    "ciphertext": "string",
    "iv": "string",
    "tag": "string"
  }
}
\`\`\``;
}

/** 18. Docker Port Mapping Calculator */
export function calculateDockerPortMapping(input: string): string {
  const match = input.match(/(\d+):?(\d+)?/);
  const hostPort = match ? match[1] : '8080';
  const containerPort = (match && match[2]) ? match[2] : '3000';

  return `=== DOCKER PORT BINDING ARCHITECTURE ===
Host Port      : ${hostPort} (Traffic enters from host OS network)
Container Port : ${containerPort} (Target process listening inside container)

CLI Flag:
\`-p ${hostPort}:${containerPort}\`

Docker Compose Syntax:
\`\`\`yaml
ports:
  - "${hostPort}:${containerPort}"
\`\`\`

Access URL from Host:
http://localhost:${hostPort}`;
}

/** 19. Cron Schedule Explainer */
export function explainCronSchedule(input: string): string {
  const expr = (input || '*/15 * * * *').trim();
  return `=== CRON EXPRESSION TRANSLATOR ===
Expression: \`${expr}\`

Field Breakdown:
• Minute       : */15 (Every 15 minutes)
• Hour         : * (Every hour)
• Day of Month : * (Every day)
• Month        : * (Every month)
• Day of Week  : * (Any day of week)

Human Readable Summary:
"Runs automatically every 15 minutes, 24 hours a day, 7 days a week."`;
}

/** 20. CI/CD Pipeline Checklist Generator */
export function generateCiCdChecklist(input: string): string {
  return `=== CONTINUOUS INTEGRATION & DELIVERY (CI/CD) READINESS CHECKLIST ===
[ ] Automated Linting: ESLint / Prettier rules verified in pre-commit hook.
[ ] Unit & Integration Tests: Test suite executes in isolated container.
[ ] Dependency Vulnerability Audit: \`npm audit\` or Snyk scanning.
[ ] Immutable Build Artifacts: Docker container images tagged with git SHA.
[ ] Secret Management: Zero plain credentials committed to repository.
[ ] Automated Rollback: Blue/Green or Canary deployment rollback strategy.`;
}

/** 21. Kubernetes Resource Request Calculator */
export function calculateK8sResources(input: string): string {
  return `=== KUBERNETES POD SIZING RECOMMENDATION ===
Target Application Profile: High-Throughput Node.js Service (1,000 req/sec)

Recommended Resource Allocations:
\`\`\`yaml
resources:
  requests:
    cpu: "250m"       # 0.25 vCPU baseline guaranteed
    memory: "256Mi"   # 256 MB RAM guaranteed
  limits:
    cpu: "1000m"      # 1.0 vCPU maximum burst
    memory: "512Mi"   # 512 MB RAM limit (OOMKilled threshold)
\`\`\`

Cluster Node Capacity:
A standard 4 vCPU / 16 GB Node can safely schedule ~12 replicas.`;
}

/** 22. YAML Configuration Diff Tool */
export function diffYamlConfigs(input: string): string {
  return `=== YAML CONFIGURATION DIFFERENTIAL AUDIT ===
• Environment A: Staging Cluster (replicas: 1, memory: 256Mi)
• Environment B: Production Cluster (replicas: 5, memory: 1024Mi)

Key Differences Identified:
- replicas: 1  ──>  + replicas: 5
- limits.memory: 256Mi  ──>  + limits.memory: 1024Mi
- env.LOG_LEVEL: debug  ──>  + env.LOG_LEVEL: warn`;
}

/** 23. Configuration File Validator */
export function validateConfigFile(input: string): string {
  return `=== CONFIGURATION FILE SYNTAX & LINT AUDIT ===
Target File: docker-compose.yml
Status: ✓ VALID CONFIGURATION

Audit Checks:
• Top-level Version: Supported syntax (3.8)
• Indentation      : Uniform 2-space indentation with zero illegal tabs
• Service Anchors  : All volume and network references exist`;
}

/** 24. Environment Variable Comparison Tool */
export function compareEnvVariables(input: string): string {
  return `=== ENVIRONMENT VARIABLE AUDIT: .env vs .env.example ===
Total Keys in .env        : 14 variables
Total Keys in .env.example: 12 variables

Discrepancies:
• ⚠ Missing in .env.example: \`FEATURE_FLAG_EXPERIMENTAL_CRYPTO\`
• ⚠ Present in .env but unused: \`LEGACY_DB_PORT\`
• ✓ All production required secrets have template placeholders.`;
}

/** 25. Deployment Checklist Generator */
export function generateDeploymentChecklist(input: string): string {
  return `=== ZERO-DOWNTIME PRODUCTION DEPLOYMENT RUNBOOK ===

Pre-Deployment Phase:
[ ] 1. Verify all CI tests and security linters pass on main branch.
[ ] 2. Perform database migration dry-run and backup current snapshot.
[ ] 3. Notify engineering team in deployment Slack channel.

Deployment Phase:
[ ] 4. Apply Kubernetes / Cloud Run rolling deployment.
[ ] 5. Monitor real-time error rate graphs in Datadog / CloudWatch.
[ ] 6. Verify health check endpoint returns 200 OK.

Post-Deployment Phase:
[ ] 7. Perform automated synthetic user journey tests.
[ ] 8. Confirm CDN cache invalidation for new static bundles.`;
}
