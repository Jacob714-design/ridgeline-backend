# Environment Variables Documentation

## Required Variables

### Database Configuration
- `DATABASE_URL`: PostgreSQL connection string
  - Format: `postgresql://user:password@host:port/database`
  - Example: `postgresql://postgres:password@localhost:5432/ridgeline`

### Authentication
- `JWT_SECRET`: Secret key for signing JWT tokens
  - Should be a long, random string
  - Generate with: `openssl rand -base64 32`
- `SESSION_SECRET`: Secret key for session cookies
  - Should be different from JWT_SECRET

### AWS Configuration
- `AWS_REGION`: AWS region for S3 bucket
  - Example: `us-east-1`
- `AWS_ACCESS_KEY_ID`: AWS IAM access key
- `AWS_SECRET_ACCESS_KEY`: AWS IAM secret key
- `S3_BUCKET_NAME`: Name of S3 bucket for document storage

### Application
- `FRONTEND_URL`: Frontend application URL for CORS
  - Development: `http://localhost:3000`
  - Production: `https://app.ridgeline.com`

## Optional Variables

### Server Configuration
- `PORT`: Server port (default: `3001`)
- `NODE_ENV`: Environment mode (`development`, `production`, `test`)

### Authentication Options
- `JWT_EXPIRES_IN`: JWT token expiration time
  - Default: `7d`
  - Format: `1h`, `24h`, `7d`, `30d`

### Logging
- `LOG_LEVEL`: Winston log level
  - Options: `error`, `warn`, `info`, `debug`
  - Default: `info` (production), `debug` (development)

## Example .env File

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/ridgeline

# Server
PORT=3001
NODE_ENV=development

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
SESSION_SECRET=your-session-secret-here

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
S3_BUCKET_NAME=ridgeline-documents-dev

# CORS
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

## Production Considerations

1. Use strong, unique secrets for JWT and sessions
2. Store secrets in a secure vault (AWS Secrets Manager, etc.)
3. Use IAM roles instead of access keys when possible
4. Enable SSL/TLS for database connections
5. Restrict CORS origins to specific domains
6. Set appropriate token expiration times