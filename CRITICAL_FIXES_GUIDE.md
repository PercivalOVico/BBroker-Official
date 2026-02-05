# Phase 1 - Critical Fixes Implementation Guide

**Status**: Ready to Execute  
**Est. Time**: 2-3 hours  
**Priority**: CRITICAL  

---

## 🚨 Critical Issues to Fix Before Phase 2

### 1. ✅ Push Database Schema (Already Fixed!)

**Status**: drizzle.config.ts exists  
**Action**: Run push command

```bash
# Push schema to Neon database
npm run db:push

# Verify in studio
npm run db:studio
```

**Verification**:
```bash
# Connect to database
psql 'postgresql://neondb_owner:npg_ipzrL51dSefx@ep-quiet-glitter-ahng16tp-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

# List tables
\dt

# Should see all 39 tables
```

---

### 2. 🔒 Add Password Hashing

**Install bcrypt**:
```bash
npm install bcrypt
npm install -D @types/bcrypt
```

**Update server/routes.ts** (Login endpoint):

```typescript
import bcrypt from 'bcrypt';

// Replace the login endpoint
app.post(api.auth.login.path, async (req, res) => {
  const { username, password } = req.body;
  
  // Validation
  if (!username || username.trim().length < 2) {
    return res.status(400).json({ 
      error: 'Invalid username',
      message: 'Username must be at least 2 characters'
    });
  }

  let user = await storage.getUserByUsername(username);
  
  if (!user) {
    // New user - hash password
    const hashedPassword = await bcrypt.hash(password || 'defaultPassword123', 10);
    
    user = await storage.createUser({
      username,
      email: `${username}@bbroker.app`,
      password: hashedPassword, // Store hashed password
      fullName: username,
      profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      bio: "Digital Enthusiast",
    });
  } else if (password) {
    // Existing user - verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Username or password is incorrect'
      });
    }
  }
  
  // Return user (don't send password)
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});
```

**Update LoginModal.tsx** (Add password field):

```typescript
// Add password state
const [password, setPassword] = useState("");

// Update form
<div className="space-y-2">
  <Label htmlFor="password" className="text-sm font-medium">
    Password
  </Label>
  <div className="relative">
    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
    <Input 
      id="password"
      type="password"
      placeholder="Enter your password" 
      value={password} 
      onChange={(e) => setPassword(e.target.value)}
      className="h-12 pl-10 rounded-xl"
      disabled={isPending}
    />
  </div>
</div>

// Update API call
const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
  username: username.trim(),
  password: password, // Send password
});
```

---

### 3. 🌐 Add CORS

**Install CORS**:
```bash
npm install cors
npm install -D @types/cors
```

**Update server/index.ts**:

```typescript
import cors from 'cors';

// Add before routes
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'http://localhost:5000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id'],
}));
```

---

### 4. ⚡ Add Rate Limiting

**Install rate limiter**:
```bash
npm install express-rate-limit
```

**Create server/middleware/rate-limit.ts**:

```typescript
import rateLimit from 'express-rate-limit';

// General API rate limit
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limit for authentication
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per window
  message: 'Too many login attempts, please try again later',
  skipSuccessfulRequests: true,
});

// Create business limit
export const createBusinessLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 business creations per hour
  message: 'Too many business creation attempts',
});
```

**Update server/routes.ts**:

```typescript
import { authLimiter, createBusinessLimiter } from './middleware/rate-limit';

// Apply to login endpoint
app.post(api.auth.login.path, authLimiter, async (req, res) => {
  // ... login logic
});

// Apply to business setup
app.post('/api/businesses/setup', createBusinessLimiter, optionalAuthMiddleware, ProfileController.createBusinessProfile);
```

---

### 5. ✅ Add Input Validation

**Create server/validators/auth.validator.ts**:

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string()
    .min(2, 'Username must be at least 2 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .optional(),
});

export const businessSetupSchema = z.object({
  businessName: z.string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must be less than 100 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(1),
    country: z.string().min(1),
  }),
  mainCategory: z.string().min(1),
  targetMarket: z.enum(['neighborhood', 'local', 'regional', 'national', 'global']),
  targetAgeRanges: z.array(z.string()).min(1),
});
```

**Use in routes.ts**:

```typescript
import { loginSchema, businessSetupSchema } from './validators/auth.validator';

app.post(api.auth.login.path, authLimiter, async (req, res) => {
  // Validate input
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      error: 'Validation failed',
      issues: validation.error.issues,
    });
  }

  const { username, password } = validation.data;
  // ... rest of logic
});
```

---

### 6. 📝 Add Error Logging

**Install Winston**:
```bash
npm install winston
```

**Create server/lib/logger.ts**:

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Write errors to file
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    // Write all logs to file
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
  ],
});

export default logger;
```

**Use in routes.ts**:

```typescript
import logger from './lib/logger';

app.post(api.auth.login.path, authLimiter, async (req, res) => {
  try {
    // ... logic
    logger.info('User logged in', { username: user.username });
  } catch (error) {
    logger.error('Login failed', { error, username: req.body.username });
    res.status(500).json({ error: 'Login failed' });
  }
});
```

---

## 📝 Complete Implementation Script

**Run in order**:

```bash
# 1. Install dependencies
npm install bcrypt cors express-rate-limit winston
npm install -D @types/bcrypt @types/cors

# 2. Push database schema
npm run db:push

# 3. Verify tables
npm run db:studio

# 4. Create directories
mkdir -p server/middleware server/validators server/lib logs

# 5. Copy the code files above into:
# - server/middleware/rate-limit.ts
# - server/validators/auth.validator.ts
# - server/lib/logger.ts
# - Update server/routes.ts
# - Update server/index.ts
# - Update client/src/components/LoginModal.tsx

# 6. Test TypeScript compilation
npm run check

# 7. Start dev server
npm run dev

# 8. Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# 9. Verify user in database
psql 'postgresql://...' -c "SELECT id, username, email FROM users;"
```

---

## ✅ Verification Checklist

After implementation:

- [ ] Database schema pushed (39 tables exist)
- [ ] Drizzle Studio accessible
- [ ] CORS configured
- [ ] Rate limiting on login (max 5 attempts)
- [ ] Input validation working
- [ ] Passwords hashed in database
- [ ] Error logging to files
- [ ] TypeScript compiles (`npm run check`)
- [ ] Dev server starts (`npm run dev`)
- [ ] Can create user with password
- [ ] Can login with correct password
- [ ] Cannot login with wrong password
- [ ] Rate limit triggers after 5 attempts

---

## 🎯 Time Estimates

- **Install dependencies**: 5 minutes
- **Push database schema**: 10 minutes
- **Add password hashing**: 30 minutes
- **Add CORS**: 10 minutes
- **Add rate limiting**: 20 minutes
- **Add input validation**: 30 minutes
- **Add error logging**: 20 minutes
- **Testing**: 30 minutes

**Total**: ~2.5 hours

---

## 🚀 After Completion

Phase 1 will be:
- ✅ 100% complete
- ✅ Production-ready (security)
- ✅ Fully tested
- ✅ Ready for Phase 2

**Then you can confidently move to Phase 2!** 🎉
