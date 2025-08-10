# Deployment

Deployment guides and configuration for MTK Care Help.

## Contents

- [Production Deployment](./production.md) - Production deployment guide
- [Environment Configuration](./environment.md) - Environment variables and configuration
- [CI/CD Setup](./cicd.md) - Continuous integration and deployment
- [Docker](./docker.md) - Containerization setup

## Quick Deployment

### Prerequisites
- Node.js 18+ runtime environment
- Domain name and SSL certificate (for production)

### Build Process
```bash
# Install dependencies
npm ci

# Build the application
npm run build

# Start production server
npm run start
```

### Environment Variables
Create `.env.local` file with required variables:
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Deployment Platforms

### Vercel (Recommended)
- Automatic deployments from Git
- Built-in SSL and CDN
- Serverless functions support

### Docker
- Containerized deployment
- Consistent across environments
- Easy scaling and orchestration

### Traditional Hosting
- VPS or dedicated server
- Manual deployment process
- Full control over environment