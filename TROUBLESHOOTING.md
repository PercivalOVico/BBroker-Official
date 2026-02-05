# BBroker Troubleshooting Guide

**Quick fixes for common errors**

---

## 🔧 Common Import Errors

### Error: "Cannot find module './db'"

**Location**: `server/middleware/auth.ts` or `server/controllers/*.ts`

**Cause**: Wrong import path - middleware and controllers are in subdirectories

**Fix**:
```typescript
// ❌ WRONG (in middleware or controllers):
import { db } from './db';

// ✅ CORRECT:
import { db } from '../db';
```

**Why**: Files in `server/middleware/` or `server/controllers/` need to go up one level (`../`) to access `server/db.ts`

---

### Error: "Cannot find module '@shared/schema'"

**Cause**: TypeScript path alias not configured

**Fix**: Ensure `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["./shared/*"]
    }
  }
}
```

**Quick test**:
```bash
npm run check
```

---

## 🗄️ Database Errors

### Error: "DATABASE_URL must be set"

**Cause**: Missing `.env` file or DATABASE_URL not set

**Fix**:
```bash
# 1. Check if .env exists
ls -la .env

# 2. If missing, copy from example:
cp .env.example .env

# 3. Add your Neon PostgreSQL connection string:
DATABASE_URL="postgresql://neondb_owner:npg_ipzrL51dSefx@ep-quiet-glitter-ahng16tp-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

---

### Error: "relation 'users' does not exist"

**Cause**: Database schema not pushed to Neon

**Fix**:
```bash
# Push schema to database
npm run db:push

# Verify tables created
npm run db:studio
```

---

### Error: "Connection timeout" / "ECONNREFUSED"

**Cause**: Database not accessible or wrong credentials

**Fix**:
```bash
# 1. Test connection with psql:
psql 'postgresql://neondb_owner:npg_ipzrL51dSefx@ep-quiet-glitter-ahng16tp-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require'

# 2. If fails, check:
# - Internet connection
# - Firewall settings
# - Neon dashboard (console.neon.tech)

# 3. Verify .env has correct DATABASE_URL
cat .env | grep DATABASE_URL
```

---

## 🔐 Authentication Errors

### Error: "Unauthorized" (401)

**Cause**: Missing userId in request

**Debug**:
```bash
# Check localStorage in browser console:
localStorage.getItem('userId')

# Should return a UUID like:
# "550e8400-e29b-41d4-a716-446655440000"

# If null, you need to login again
```

**Fix**:
```bash
# Test login:
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser"}'

# Save the returned id to localStorage in browser:
localStorage.setItem('userId', 'RETURNED_ID_HERE')
```

---

### Error: "User not found" (401)

**Cause**: userId in localStorage doesn't exist in database

**Fix**:
```bash
# 1. Clear localStorage
localStorage.clear()

# 2. Login again
# Visit http://localhost:5000
# Click "Login"
# Enter username and submit

# 3. Verify user created:
npm run db:studio
# Check users table
```

---

## 🚀 Server Errors

### Error: "Port 5000 already in use"

**Fix**:
```bash
# Option 1: Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Option 2: Use different port
PORT=5001 npm run dev

# Option 3: Update .env
echo "PORT=5001" >> .env
npm run dev
```

---

### Error: "Module not found: '@/components/...'"

**Cause**: Missing dependency or wrong path alias

**Fix**:
```bash
# 1. Install dependencies
npm install

# 2. Verify vite.config.ts has:
# resolve: {
#   alias: {
#     "@": path.resolve(__dirname, "./client/src"),
#   }
# }

# 3. Restart dev server
npm run dev
```

---

## 📦 Build Errors

### Error: "Cannot find module 'drizzle-orm'"

**Fix**:
```bash
# Install dependencies
npm install

# Specifically install drizzle-orm
npm install drizzle-orm drizzle-kit
```

---

### Error: TypeScript compilation errors

**Fix**:
```bash
# Check TypeScript errors
npm run check

# Common fixes:
# 1. Update type definitions
npm install --save-dev @types/node @types/express

# 2. Clear cache
rm -rf node_modules package-lock.json
npm install

# 3. Restart TypeScript server (in VSCode)
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

---

## 🧪 Testing Errors

### API endpoint returns 404

**Debug checklist**:
```bash
# 1. Check if server is running
curl http://localhost:5000/api/feed

# 2. Check routes.ts has the endpoint
grep "api.feed.list.path" server/routes.ts

# 3. Check constants.ts has the path
grep "FEED" client/src/lib/constants.ts

# 4. Check server logs
# Look at terminal running npm run dev
```

---

### API returns 500 Internal Server Error

**Debug**:
```bash
# 1. Check server logs (terminal)
# Look for error stack trace

# 2. Check database connection
npm run db:studio

# 3. Add more logging:
# In routes.ts, add:
console.log('Request:', req.method, req.url);
console.log('Body:', req.body);
```

---

## 🎨 Frontend Errors

### React component not rendering

**Debug**:
```bash
# 1. Check browser console for errors
# F12 → Console tab

# 2. Check component import
# Ensure correct path and export

# 3. Check if wrapped in Suspense (if lazy loaded)

# 4. Clear browser cache
# Cmd/Ctrl + Shift + R (hard reload)
```

---

### Hooks not working (useProfileSwitch, etc.)

**Common issues**:
```typescript
// ❌ WRONG: Calling hook conditionally
if (condition) {
  const { data } = useProfileSwitch();
}

// ✅ CORRECT: Call hooks at top level
const { data } = useProfileSwitch();
if (condition && data) {
  // use data
}
```

---

## 🛠️ Quick Diagnostic Commands

### Full System Check:
```bash
# 1. Check Node version (should be 18+)
node --version

# 2. Check npm version
npm --version

# 3. Check if all dependencies installed
npm list --depth=0

# 4. Run TypeScript check
npm run check

# 5. Test database connection
npm run db:studio

# 6. Run import validation
bash scripts/validate-imports.sh

# 7. Start server
npm run dev
```

---

## 🔄 Nuclear Option (Start Fresh)

**If nothing else works**:

```bash
# 1. Stop all servers
# Ctrl+C in all terminals

# 2. Clean everything
rm -rf node_modules package-lock.json
rm -rf dist
rm -rf .next (if exists)

# 3. Reinstall
npm install

# 4. Verify .env exists
ls -la .env
# If not, copy from .env.example

# 5. Push database schema
npm run db:push

# 6. Start fresh
npm run dev

# 7. Test login
# Open http://localhost:5000
# Click "Login"
# Enter username "testuser"
```

---

## 📞 Getting Help

### Before asking for help, collect:

1. **Error message** (full stack trace)
2. **What you tried** (commands run)
3. **Environment info**:
   ```bash
   node --version
   npm --version
   cat .env | grep NODE_ENV
   ```

4. **Relevant logs**:
   - Server terminal output
   - Browser console errors (F12)
   - Network tab (F12 → Network)

### Useful debugging info:

```bash
# Get full error details
npm run dev 2>&1 | tee debug.log

# Check if database is accessible
psql 'postgresql://...' -c "SELECT 1"

# List all running node processes
ps aux | grep node

# Check what's using port 5000
lsof -i :5000
```

---

## ✅ Validation Checklist

Before deploying or continuing development:

- [ ] `.env` file exists with DATABASE_URL
- [ ] `npm install` completed successfully
- [ ] `npm run check` passes (no TypeScript errors)
- [ ] `npm run db:push` completed (tables created)
- [ ] `npm run db:studio` opens (database accessible)
- [ ] `npm run dev` starts without errors
- [ ] Can access http://localhost:5000
- [ ] Can login and create user
- [ ] `bash scripts/validate-imports.sh` passes

---

## 🎯 Most Common Issues (Quick Reference)

| Error | Quick Fix |
|-------|-----------|
| Import error | Check import path (../ vs ./) |
| DATABASE_URL | Copy .env.example to .env |
| Table not exist | Run `npm run db:push` |
| Port in use | `lsof -ti:5000 \| xargs kill -9` |
| 401 Unauthorized | Login again, check userId in localStorage |
| 500 Server Error | Check server logs, verify database |
| Module not found | `npm install` |
| TypeScript errors | `npm run check`, update types |

---

**Most issues can be solved by**:
1. Checking server logs
2. Verifying .env exists
3. Running `npm install`
4. Pushing database schema
5. Restarting the server

**Still stuck? Review the documentation in the repo!**
