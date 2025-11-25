# Environment Setup Quick Reference

## 🚀 Quick Start

### 1. Copy Environment Files
```bash
# For production/deployment
cp .env.example .env

# For local development (recommended)
cp .env.local.example .env.local
```

### 2. Generate Secrets
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

### 3. Update Values
Edit `.env.local` with your actual values:
```bash
# Example local development setup
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXTAUTH_SECRET=your-generated-secret-here
```

### 4. Start Development
```bash
yarn dev
```

---

## 📁 File Structure

```
.env                    # Production config (git-ignored)
.env.example           # Production template (committed)
.env.local             # Local overrides (git-ignored) ⭐ Use this for dev
.env.local.example     # Local template (committed)
ENV_GUIDE.md          # Complete documentation
ENV_SETUP.md          # This quick reference
```

---

## ⚡ Essential Variables

### Required for All Environments

```bash
# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend API URL (must start with NEXT_PUBLIC_)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

# Authentication Secret (minimum 32 characters)
NEXTAUTH_SECRET=generate-using-openssl-rand-base64-32

# NextAuth URL (same as app URL)
NEXTAUTH_URL=http://localhost:3000
```

---

## 🎯 Environment-Specific Examples

### Local Development
```bash
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_DEBUG=true
NEXTAUTH_SECRET=local-dev-secret-minimum-32-characters
NEXTAUTH_URL=http://localhost:3000
```

### Production
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com
NEXT_PUBLIC_DEBUG=false
NEXTAUTH_SECRET=your-production-secret-from-openssl
NEXTAUTH_URL=https://your-domain.com
```

---

## 🔧 Common Issues & Solutions

### Issue: Variables not loading
**Solution**: Restart dev server
```bash
# Stop server (Ctrl+C) then:
yarn dev
```

### Issue: Variable undefined in browser
**Solution**: Add `NEXT_PUBLIC_` prefix
```bash
# ❌ Wrong (only works server-side)
API_URL=http://api.example.com

# ✅ Correct (works in browser)
NEXT_PUBLIC_API_URL=http://api.example.com
```

### Issue: Changes not reflecting
**Solution**: Clear cache and restart
```bash
rm -rf .next
yarn dev
```

---

## 📚 Full Documentation

For complete details, see [ENV_GUIDE.md](./ENV_GUIDE.md)

---

## ✅ Checklist

Before deploying, ensure:

- [ ] All required variables are set
- [ ] `NEXTAUTH_SECRET` is at least 32 characters
- [ ] Production URLs use HTTPS
- [ ] `.env` file is in `.gitignore`
- [ ] No secrets committed to git
- [ ] Different secrets for dev/prod

---

## 🆘 Need Help?

1. Read [ENV_GUIDE.md](./ENV_GUIDE.md) for detailed documentation
2. Check `.env.example` for all available variables
3. Verify your setup matches the examples above
