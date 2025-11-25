# Environment Variables Guide

## 📋 Table of Contents
- [Overview](#overview)
- [File Structure](#file-structure)
- [Setup Instructions](#setup-instructions)
- [Variable Reference](#variable-reference)
- [Best Practices](#best-practices)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

---

## Overview

This project uses environment variables to configure different aspects of the application across various environments (development, staging, production).

### Environment File Priority (Next.js)

Next.js loads environment variables in the following priority order:

1. `.env.local` (highest priority, ignored by git)
2. `.env.production` or `.env.development` (depending on NODE_ENV)
3. `.env` (lowest priority)

**Note**: `.env.local` always takes precedence except during tests.

---

## File Structure

```
project-root/
├── .env                    # Main production environment (git-ignored)
├── .env.example            # Template for production (committed)
├── .env.local              # Local overrides (git-ignored)
├── .env.local.example      # Template for local dev (committed)
├── .env.development        # Development environment (optional)
├── .env.production         # Production environment (optional)
└── ENV_GUIDE.md           # This file
```

### File Descriptions

| File | Purpose | Git Tracked | Priority |
|------|---------|-------------|----------|
| `.env` | Production/default configuration | ❌ No | Low |
| `.env.example` | Template for production setup | ✅ Yes | N/A |
| `.env.local` | Local development overrides | ❌ No | High |
| `.env.local.example` | Template for local setup | ✅ Yes | N/A |
| `.env.development` | Development environment | ❌ No | Medium |
| `.env.production` | Production environment | ❌ No | Medium |

---

## Setup Instructions

### For First-Time Setup

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **For local development**:
   ```bash
   cp .env.local.example .env.local
   ```

3. **Fill in your values**:
   - Open `.env` or `.env.local` in your editor
   - Replace placeholder values with actual credentials
   - **Never commit these files to version control**

### Quick Start for Developers

```bash
# Clone the repository
git clone <your-repo-url>
cd rest_api_maker

# Copy environment files
cp .env.example .env.local

# Edit with your local values
nano .env.local  # or use your preferred editor

# Install dependencies
yarn install

# Start development server
yarn dev
```

---

## Variable Reference

### 🔵 Application Configuration

#### `NODE_ENV`
- **Type**: String
- **Options**: `development` | `staging` | `production`
- **Default**: `development`
- **Description**: Determines the application environment
- **Example**: `NODE_ENV=production`

#### `NEXT_PUBLIC_APP_NAME`
- **Type**: String
- **Required**: No
- **Description**: Display name of your application
- **Example**: `NEXT_PUBLIC_APP_NAME="Rest API Maker"`

#### `NEXT_PUBLIC_APP_URL`
- **Type**: URL
- **Required**: Yes
- **Description**: Base URL where your app is hosted
- **Example**: 
  - Dev: `http://localhost:3000`
  - Prod: `https://your-domain.com`

---

### 🔵 API Configuration

#### `NEXT_PUBLIC_API_BASE_URL`
- **Type**: URL
- **Required**: Yes
- **Description**: Backend API base URL. **Must** start with `NEXT_PUBLIC_` to be accessible in the browser
- **Example**: 
  - Dev: `http://localhost:8000/api`
  - Prod: `https://api.your-domain.com`

#### `NEXT_PUBLIC_API_TIMEOUT`
- **Type**: Number (milliseconds)
- **Required**: No
- **Default**: `30000` (30 seconds)
- **Description**: Maximum time to wait for API responses
- **Example**: `NEXT_PUBLIC_API_TIMEOUT=60000`

#### `NEXT_PUBLIC_API_VERSION`
- **Type**: String
- **Required**: No
- **Description**: API version identifier
- **Example**: `NEXT_PUBLIC_API_VERSION=v1`

---

### 🔵 Authentication (NextAuth.js)

#### `NEXTAUTH_SECRET`
- **Type**: String
- **Required**: Yes (in production)
- **Description**: Secret key for encrypting tokens and sessions
- **Generate**: `openssl rand -base64 32`
- **Example**: `NEXTAUTH_SECRET=your-super-secret-32-char-minimum-string`
- **⚠️ Security**: Must be at least 32 characters long

#### `NEXTAUTH_URL`
- **Type**: URL
- **Required**: Yes (in production)
- **Description**: Full URL of your application
- **Example**: 
  - Dev: `http://localhost:3000`
  - Prod: `https://your-domain.com`

#### `NEXTAUTH_BASEPATH`
- **Type**: String
- **Required**: No
- **Default**: `/api/auth`
- **Description**: Base path for NextAuth.js API routes
- **Example**: `NEXTAUTH_BASEPATH=/api/auth`

#### `NEXTAUTH_SESSION_MAX_AGE`
- **Type**: Number (seconds)
- **Required**: No
- **Default**: `2592000` (30 days)
- **Description**: How long a session remains valid
- **Example**: `NEXTAUTH_SESSION_MAX_AGE=604800` (7 days)

---

### 🔵 Feature Flags

#### `NEXT_PUBLIC_ENABLE_ANALYTICS`
- **Type**: Boolean
- **Default**: `false`
- **Description**: Enable/disable analytics tracking
- **Example**: `NEXT_PUBLIC_ENABLE_ANALYTICS=true`

#### `NEXT_PUBLIC_ENABLE_ERROR_REPORTING`
- **Type**: Boolean
- **Default**: `false`
- **Description**: Enable/disable error reporting (e.g., Sentry)
- **Example**: `NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true`

#### `NEXT_PUBLIC_ENABLE_MAINTENANCE_MODE`
- **Type**: Boolean
- **Default**: `false`
- **Description**: Put the application in maintenance mode
- **Example**: `NEXT_PUBLIC_ENABLE_MAINTENANCE_MODE=true`

---

### 🔵 Third-Party Services (Optional)

#### Google OAuth
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### GitHub OAuth
```bash
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

#### Email Service
```bash
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@your-domain.com
```

---

### 🔵 Monitoring & Analytics

#### Sentry (Error Tracking)
```bash
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

#### Google Analytics
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

### 🔵 Development Tools

#### `NEXT_PUBLIC_DEBUG`
- **Type**: Boolean
- **Default**: `false`
- **Description**: Enable debug logging
- **Example**: `NEXT_PUBLIC_DEBUG=true`

#### `NEXT_PUBLIC_SHOW_ERROR_DETAILS`
- **Type**: Boolean
- **Default**: `true`
- **Description**: Show detailed error messages
- **Example**: `NEXT_PUBLIC_SHOW_ERROR_DETAILS=false`

---

### 🔵 Security

#### `ALLOWED_ORIGINS`
- **Type**: String (comma-separated URLs)
- **Description**: CORS allowed origins
- **Example**: `ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com`

#### `RATE_LIMIT_MAX_REQUESTS`
- **Type**: Number
- **Default**: `100`
- **Description**: Maximum requests per time window
- **Example**: `RATE_LIMIT_MAX_REQUESTS=200`

#### `RATE_LIMIT_WINDOW_MS`
- **Type**: Number (milliseconds)
- **Default**: `900000` (15 minutes)
- **Description**: Time window for rate limiting
- **Example**: `RATE_LIMIT_WINDOW_MS=60000` (1 minute)

---

## Best Practices

### ✅ DO

1. **Use `.env.local` for local development**
   ```bash
   # Never commit this file
   cp .env.local.example .env.local
   ```

2. **Prefix client-side variables with `NEXT_PUBLIC_`**
   ```bash
   # ✅ Accessible in browser
   NEXT_PUBLIC_API_URL=https://api.example.com
   
   # ❌ Only available server-side
   API_SECRET_KEY=secret123
   ```

3. **Generate strong secrets**
   ```bash
   # Generate NEXTAUTH_SECRET
   openssl rand -base64 32
   ```

4. **Document new variables**
   - Add to `.env.example`
   - Update this guide
   - Add to TypeScript types if needed

5. **Use different values per environment**
   ```bash
   # Development
   NEXT_PUBLIC_API_URL=http://localhost:8000
   
   # Production
   NEXT_PUBLIC_API_URL=https://api.production.com
   ```

### ❌ DON'T

1. **Never commit actual `.env` files**
   ```bash
   # These should be in .gitignore
   .env
   .env.local
   .env.production
   ```

2. **Never hardcode secrets in code**
   ```javascript
   // ❌ Bad
   const apiKey = "sk_live_abc123";
   
   // ✅ Good
   const apiKey = process.env.API_KEY;
   ```

3. **Don't use weak secrets**
   ```bash
   # ❌ Bad
   NEXTAUTH_SECRET=secret123
   
   # ✅ Good
   NEXTAUTH_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   ```

4. **Don't expose server secrets to client**
   ```bash
   # ❌ Bad - exposes secret to browser
   NEXT_PUBLIC_DATABASE_PASSWORD=secret
   
   # ✅ Good - only available server-side
   DATABASE_PASSWORD=secret
   ```

---

## Security

### 🔒 Secret Management

1. **Production Secrets**
   - Use environment variable management services (Vercel, AWS Secrets Manager, etc.)
   - Rotate secrets regularly
   - Use different secrets for each environment

2. **Development Secrets**
   - Use `.env.local` for local overrides
   - Never share actual credentials in team chat/email
   - Use placeholder values in `.env.example`

3. **Access Control**
   - Limit who has access to production secrets
   - Use role-based access control
   - Audit secret access regularly

### 🛡️ Security Checklist

- [ ] `.env` files are in `.gitignore`
- [ ] No secrets committed to version control
- [ ] `NEXTAUTH_SECRET` is at least 32 characters
- [ ] Production URLs use HTTPS
- [ ] API keys are rotated regularly
- [ ] Different secrets for dev/staging/prod
- [ ] Team members use their own `.env.local`

---

## Troubleshooting

### Environment variables not loading

**Problem**: Variables are undefined in the application

**Solutions**:
1. Restart the development server
   ```bash
   # Stop the server (Ctrl+C) and restart
   yarn dev
   ```

2. Check variable prefix
   ```bash
   # Client-side access requires NEXT_PUBLIC_
   NEXT_PUBLIC_API_URL=...  # ✅ Works in browser
   API_URL=...              # ❌ Only works server-side
   ```

3. Verify file name
   ```bash
   # Correct file names
   .env
   .env.local
   .env.production
   
   # ❌ Wrong
   env.txt
   .environment
   ```

### Variables showing undefined in browser

**Problem**: `process.env.SOME_VAR` is undefined in client components

**Solution**: Add `NEXT_PUBLIC_` prefix
```bash
# Before
API_KEY=abc123

# After
NEXT_PUBLIC_API_KEY=abc123
```

### Changes not reflecting

**Problem**: Updated `.env` but changes don't appear

**Solution**:
1. Restart the development server
2. Clear Next.js cache
   ```bash
   rm -rf .next
   yarn dev
   ```

### Type errors with environment variables

**Solution**: Create type definitions
```typescript
// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;
    NEXTAUTH_SECRET: string;
    // ... other variables
  }
}
```

---

## Environment-Specific Configuration

### Development
```bash
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_DEBUG=true
```

### Staging
```bash
NODE_ENV=staging
NEXT_PUBLIC_APP_URL=https://staging.your-domain.com
NEXT_PUBLIC_API_BASE_URL=https://api-staging.your-domain.com
NEXT_PUBLIC_DEBUG=false
```

### Production
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

## Additional Resources

- [Next.js Environment Variables Docs](https://nextjs.org/docs/basic-features/environment-variables)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Last Updated**: November 4, 2025
