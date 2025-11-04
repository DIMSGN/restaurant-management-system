# 🔒 Security Features

## Overview

This application implements **production-grade security** measures to protect against common vulnerabilities.

---

## 🛡️ Authentication & Authorization

### JWT Tokens
- **Algorithm**: HS256
- **Access Token Expiry**: 15 minutes (configurable)
- **Refresh Token Expiry**: 7 days (configurable)
- **Secret Validation**: App fails to start if secrets are missing from `.env`

### Password Security
- **Hashing**: bcrypt with 10 salt rounds
- **Strong Password Policy**:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character
  - Examples: `Admin@123`, `MyPass#2024`

### Username Validation
- 3-50 characters
- Alphanumeric and underscores only
- No spaces or special characters

---

## ⏱️ Rate Limiting

### Auth Endpoints (`/api/auth/*`)
- **Limit**: 5 requests per 15 minutes
- **Purpose**: Prevent brute force login attacks
- **Response**: 429 Too Many Requests

### API Endpoints (`/api/*`)
- **Limit**: 100 requests per 15 minutes
- **Purpose**: Prevent API abuse and DoS
- **Response**: 429 Too Many Requests

### Create Operations
- **Limit**: 10 requests per 1 minute
- **Purpose**: Prevent spam/automation
- **Applies to**: POST `/api/products`, `/api/recipes`, `/api/sales`

### Headers Returned
```
RateLimit-Limit: 100
RateLimit-Remaining: 99
RateLimit-Reset: 1699123456
```

---

## 🛡️ HTTP Security Headers (Helmet)

Automatically applied to all responses:

### Content-Security-Policy
- Prevents XSS attacks
- Restricts resource loading

### X-Frame-Options
- `DENY` - Prevents clickjacking attacks
- App cannot be embedded in iframes

### X-Content-Type-Options
- `nosniff` - Prevents MIME type sniffing

### Strict-Transport-Security
- Forces HTTPS in production
- `max-age=15552000` (180 days)

### X-XSS-Protection
- Legacy XSS protection for older browsers

---

## 🔍 Input Validation

### Zod Schema Validation
All API inputs validated before processing:

**Products:**
- ✅ Name: 1-255 chars, trimmed
- ✅ Amount: >= 0
- ✅ Price: > 0
- ✅ Purchase Price: > 0
- ✅ Price must be > Purchase Price
- ✅ Minimum Stock: >= 0
- ✅ Minimum Stock must be <= Current Amount
- ✅ Expiration Date > Received Date

**Recipes:**
- ✅ Name: 1-255 chars
- ✅ Sale Price: > 0
- ✅ Ingredients: Minimum 1 item
- ✅ Product IDs must exist
- ✅ Amounts: > 0

**Sales:**
- ✅ Quantity: > 0
- ✅ Either Recipe ID or Product ID required (not both)
- ✅ Stock validation before sale
- ✅ Payment method: enum validation

---

## 🔐 CORS Configuration

**Development:**
```javascript
origin: 'http://localhost:5173'
credentials: true
```

**Production:**
Set `CORS_ORIGIN` in `.env` to your frontend domain.

**Security:**
- ❌ NOT accepting all origins (`*`)
- ✅ Credentials enabled for cookie-based auth
- ✅ Pre-flight requests handled

---

## 💾 SQL Injection Prevention

**Prisma ORM Protection:**
- All queries use parameterized statements
- No raw SQL queries (except for health check)
- Input sanitization at ORM level

**Example:**
```typescript
// ✅ SAFE - Prisma parameterized query
await prisma.product.findUnique({ where: { id: productId } });

// ❌ UNSAFE - Raw SQL (we don't do this)
await prisma.$queryRaw`SELECT * FROM products WHERE id = ${productId}`;
```

---

## 🔒 Transaction Safety

### SERIALIZABLE Isolation Level
**Sales Transactions:**
```typescript
await prisma.$transaction(async (tx) => {
  // All operations here
}, {
  isolationLevel: 'Serializable',
  maxWait: 5000,
  timeout: 10000,
});
```

**Prevents:**
- Race conditions (concurrent sales)
- Phantom reads
- Non-repeatable reads
- Dirty reads

**Example Protected Scenario:**
- User A sells 10 units of Product X
- User B simultaneously sells 10 units of Product X
- Current stock: 15 units
- **Without SERIALIZABLE**: Both succeed → stock = -5 ❌
- **With SERIALIZABLE**: Second transaction fails ✅

---

## 📊 Request Body Size Limits

```javascript
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
```

**Prevents:**
- Large payload DoS attacks
- Memory exhaustion
- JSON bomb attacks

---

## 🚨 Error Handling

### Information Disclosure Prevention

**Bad Practice (information leakage):**
```javascript
throw new Error('User john@example.com not found');
throw new Error('Invalid password for admin');
```

**Good Practice (we do this):**
```javascript
throw new UnauthorizedError('Invalid credentials'); // Same for both username/password
throw new NotFoundError('Resource not found'); // Generic message
```

### Error Response Structure
```json
{
  "status": "error",
  "message": "Generic error message",
  "errors": [/* validation errors only */]
}
```

**Never exposed:**
- Stack traces (only in development logs)
- Database errors
- System paths
- Environment variables

---

## 📝 Logging Security

### Winston Logger

**Development:**
- Colorized console output
- All log levels (debug, info, warn, error)

**Production:**
- JSON structured logs
- File rotation (max 5MB per file, 5 files retained)
- Error logs in separate file
- No sensitive data logged

**What We Log:**
- Authentication attempts (success/fail)
- API requests (method, path, status)
- Database operations
- Errors with context

**What We DON'T Log:**
- Passwords (plain or hashed)
- JWT tokens
- Credit card numbers
- Personal identifying information

---

## 🏥 Health Check Security

**Public Endpoint:** `/health` (no authentication)

**Information Disclosed:**
- ✅ Server status (OK/ERROR)
- ✅ Timestamp
- ✅ Uptime
- ✅ Environment (development/production)
- ✅ Database connectivity

**NOT Disclosed:**
- Database credentials
- Server version
- Internal IPs
- Dependency versions

---

## 🔧 Environment Variables

### Required Secrets
```env
DATABASE_URL=mysql://user:pass@localhost:3306/db
JWT_ACCESS_SECRET=<strong-random-string>
JWT_REFRESH_SECRET=<strong-random-string>
```

**Security Measures:**
- ✅ App fails to start if secrets missing
- ✅ `.env` in `.gitignore`
- ✅ `.env.example` with placeholder values
- ✅ No default/fallback secrets

### Generating Strong Secrets
```bash
# Linux/Mac
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🎯 Security Best Practices Implemented

### ✅ OWASP Top 10 Protections

1. **Injection** - Prisma ORM parameterization
2. **Broken Authentication** - Strong passwords, JWT, rate limiting
3. **Sensitive Data Exposure** - bcrypt hashing, no logging of secrets
4. **XML External Entities** - N/A (JSON API)
5. **Broken Access Control** - Role-based authorization
6. **Security Misconfiguration** - Helmet headers, CORS config
7. **XSS** - Helmet CSP, input validation
8. **Insecure Deserialization** - Zod validation before processing
9. **Using Components with Known Vulnerabilities** - Regular `npm audit`
10. **Insufficient Logging & Monitoring** - Winston structured logging

---

## 🔍 Security Testing Checklist

### Manual Testing

```bash
# 1. Test rate limiting
for i in {1..6}; do curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrong"}'; done

# 2. Test large payload (should fail)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"'$(head -c 20000 < /dev/zero | tr '\0' 'A')'"}'

# 3. Test weak password (should fail)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"weak"}'

# 4. Test unauthorized access
curl http://localhost:3000/api/products
# Should return: 401 Unauthorized

# 5. Test CORS
curl -H "Origin: http://evil.com" http://localhost:3000/api/products
# Should block if not in CORS_ORIGIN
```

### Automated Tools

```bash
# NPM audit
npm audit

# OWASP ZAP
# Point to http://localhost:3000 and run active scan

# Snyk
npx snyk test
```

---

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet Documentation](https://helmetjs.github.io/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Prisma Security](https://www.prisma.io/docs/guides/database/advanced-database-tasks/sql-injection)

---

## 🚨 Incident Response

If a security issue is discovered:

1. **DO NOT** commit secrets to Git
2. **Rotate** all JWT secrets immediately
3. **Revoke** all active tokens (force re-login)
4. **Review** Winston logs for suspicious activity
5. **Patch** vulnerable dependencies: `npm audit fix`
6. **Update** password policy if needed

---

## 📞 Security Contact

For security vulnerabilities, contact: [your-security-email]

**Please DO NOT** open public GitHub issues for security vulnerabilities.
