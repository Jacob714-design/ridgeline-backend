# RidgeLine Backend API

## Overview

RidgeLine backend provides a RESTful API for the Roofing & Insurance Claims CRM system.

## Tech Stack

- Node.js (v16+)
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- AWS S3 for file storage
- Tesseract.js for OCR

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run database migrations:
```bash
pnpm prisma:migrate
```

4. Start development server:
```bash
pnpm dev
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| PORT | Server port (default: 3001) | No |
| JWT_SECRET | Secret for JWT signing | Yes |
| JWT_EXPIRES_IN | JWT expiration (default: 7d) | No |
| AWS_REGION | AWS region for S3 | Yes |
| AWS_ACCESS_KEY_ID | AWS access key | Yes |
| AWS_SECRET_ACCESS_KEY | AWS secret key | Yes |
| S3_BUCKET_NAME | S3 bucket for documents | Yes |
| SESSION_SECRET | Secret for session cookies | Yes |
| FRONTEND_URL | Frontend URL for CORS | Yes |

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Clients
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create client
- `GET /api/clients/:id` - Get client details
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client (Admin only)

### Claims
- `GET /api/claims` - List claims (filtered by role)
- `POST /api/claims` - Create claim
- `GET /api/claims/:id` - Get claim details
- `PUT /api/claims/:id` - Update claim
- `POST /api/claims/:id/projects` - Create project for claim

### Projects
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project

### Estimates
- `POST /api/projects/:id/estimate` - Generate AI estimate
- `GET /api/projects/:id/estimate` - Get estimate lines
- `PUT /api/estimate-lines/:lineId` - Update line item

### Documents
- `POST /api/projects/:id/documents` - Upload document
- `GET /api/projects/:id/documents` - List documents

### Reference Data
- `GET /api/manufacturers` - List manufacturer specs
- `GET /api/codes?zip=XXXXX` - Get building codes by ZIP

## Testing

Run tests:
```bash
pnpm test
```

Run tests with coverage:
```bash
pnpm test:coverage
```

## Project Structure

```
src/
├── controllers/     # Route handlers
├── services/        # Business logic
├── models/          # Prisma schema
├── routes/          # Express routes
├── middleware/      # Express middleware
├── utils/           # Utilities (S3, OCR, etc.)
├── schemas/         # Zod validation schemas
├── __tests__/       # Test files
└── server.ts        # App entry point
```

## Deployment

1. Build the project:
```bash
pnpm build
```

2. Run production server:
```bash
pnpm start
```

## Security

- JWT tokens for API authentication
- Session cookies for web authentication
- CSRF protection
- Rate limiting
- Input validation with Zod
- SQL injection protection via Prisma
- XSS protection via Helmet

## License

Proprietary - RidgeLine CRM