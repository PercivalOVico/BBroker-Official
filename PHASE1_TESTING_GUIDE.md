# Phase 1 - Testing & Verification Guide

**Status**: Ready for Testing  
**Critical Fixes**: ✅ Applied  
**Database**: Ready to Push  

---

## 🚀 Quick Start (5 Steps)

### Step 1: Install Dependencies
```bash
cd BBroker-Official-main
npm install
```

### Step 2: Push Database Schema
```bash
npm run db:push
```

**Expected Output**:
```
✓ Pushing schema to database...
✓ Schema pushed successfully!
✓ Created 39 tables
```

**Verify in Drizzle Studio**:
```bash
npm run db:studio
```
Then check that all 39 tables exist.

---

### Step 3: Start Application
```bash
npm run dev
```

**Expected Output**:
```
> Server running on http://localhost:5000
> Client running on http://localhost:5173
```

---

### Step 4: Test Authentication
```bash
# In a new terminal
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser"}'
```

**Expected Response**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "testuser",
  "email": "testuser@bbroker.app",
  "fullName": "testuser",
  "profilePhoto": "https://api.dicebear.com/7.x/avataaars/svg?seed=testuser",
  "bio": "Digital Enthusiast",
  "currentProfile": "user",
  "hasBusinessProfile": false,
  "status": "active",
  "createdAt": "2026-02-04T...",
  "updatedAt": "2026-02-04T..."
}
```

---

### Step 5: Test in Browser
```
1. Open http://localhost:5173
2. Click "Login" button
3. Enter username: "testuser"
4. Click "Login"
5. Should redirect to /feed
```

---

## ✅ Complete Testing Checklist

### Database Tests:

- [ ] **Schema Pushed**
  ```bash
  npm run db:push
  ```
  Check: No errors, 39 tables created

- [ ] **Tables Exist**
  ```bash
  npm run db:studio
  ```
  Check: Can see users, businesses, products tables

- [ ] **Can Insert Data**
  ```sql
  -- Via psql
  SELECT * FROM users;
  ```
  Check: testuser appears after login

---

### API Tests:

- [ ] **Login Creates User**
  ```bash
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"john_doe"}'
  ```
  Check: Returns user object with UUID id

- [ ] **Get Profile Status**
  ```bash
  curl "http://localhost:5000/api/users/profile-status?userId=YOUR_UUID_HERE"
  ```
  Check: Returns current profile status

- [ ] **Switch Profile**
  ```bash
  curl -X POST "http://localhost:5000/api/users/switch-profile?userId=YOUR_UUID_HERE" \
    -H "Content-Type: application/json" \
    -d '{"profileType":"business"}'
  ```
  Check: Returns needsSetup: true (no business yet)

- [ ] **Get Feed**
  ```bash
  curl http://localhost:5000/api/feed
  ```
  Check: Returns array (may be empty if no seed data)

- [ ] **Get Businesses**
  ```bash
  curl http://localhost:5000/api/businesses
  ```
  Check: Returns array

---

### UI Tests:

- [ ] **Landing Page Loads**
  - Visit: http://localhost:5173
  - Check: Page renders without errors

- [ ] **Login Modal Opens**
  - Click "Login" button
  - Check: Modal appears

- [ ] **Login Works**
  - Enter username
  - Click "Login"
  - Check: Redirects to /feed
  - Check: No console errors

- [ ] **Feed Page Loads**
  - Check: /feed renders
  - Check: Header shows
  - Check: Bottom nav shows

- [ ] **Profile Switcher in Header**
  - Click RefreshCw icon in header
  - Check: Profile switch modal opens
  - Check: Shows User and Business options

- [ ] **Settings Page**
  - Navigate to /settings
  - Check: Page loads
  - Check: ProfileSwitcher shows
  - Check: 8 sections visible

- [ ] **Profile Switch Modal**
  - Click RefreshCw in header
  - Try to switch to Business
  - Check: Should show "needsSetup" (no business profile yet)

- [ ] **Business Setup Wizard** (If integrated to modal)
  - Try to switch to Business
  - Check: Wizard should open
  - Fill out 6 steps
  - Submit
  - Check: Business created, 420 BBT awarded

---

## 🔍 Common Issues & Solutions

### Issue: "Cannot push schema"
**Error**: `DATABASE_URL is not set`

**Solution**:
```bash
# Check .env exists
ls -la .env

# Verify DATABASE_URL
cat .env | grep DATABASE_URL

# Should show:
# DATABASE_URL="postgresql://neondb_owner:npg_ipzrL51dSefx@..."
```

---

### Issue: "User creation fails"
**Error**: `null value in column "email" violates not-null constraint`

**Solution**: Fixed in latest commit! Email now auto-generated.

If still failing:
```bash
git pull  # Get latest fixes
```

---

### Issue: "Cannot find user"
**Error**: 401 Unauthorized

**Solution**: 
```bash
# Make sure userId is in request
curl "http://localhost:5000/api/users/profile-status?userId=YOUR_UUID"

# Or use header
curl http://localhost:5000/api/users/profile-status \
  -H "X-User-Id: YOUR_UUID"
```

---

### Issue: "Business/Product not found"
**Error**: 404 with UUID

**Solution**: Fixed in latest commit! No longer using parseInt().

Verify:
```bash
# Test with valid UUID
curl "http://localhost:5000/api/businesses/550e8400-e29b-41d4-a716-446655440000"
```

---

### Issue: "localStorage not working"
**Solution**: 
1. Open browser DevTools
2. Application tab
3. Local Storage
4. Check for:
   - userId
   - username
   - userRole

If missing, login again.

---

## 📊 Verification Queries

### Check Users in Database:
```sql
-- Connect via psql
psql 'postgresql://neondb_owner:npg_ipzrL51dSefx@ep-quiet-glitter-ahng16tp-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

-- List all users
SELECT id, username, email, current_profile, has_business_profile, created_at 
FROM users 
ORDER BY created_at DESC;

-- Count users
SELECT COUNT(*) as total_users FROM users;

-- Check specific user
SELECT * FROM users WHERE username = 'testuser';
```

### Check Businesses:
```sql
SELECT id, business_name, user_id, status, created_at 
FROM businesses 
ORDER BY created_at DESC;
```

### Check Wallets:
```sql
SELECT w.id, w.user_id, w.bbt_balance, w.lifetime_earned, u.username
FROM wallets w
JOIN users u ON w.user_id = u.id;
```

### Check Token Transactions:
```sql
SELECT tt.*, u.username
FROM token_transactions tt
JOIN wallets w ON tt.wallet_id = w.id
JOIN users u ON w.user_id = u.id
ORDER BY tt.created_at DESC;
```

---

## 🎯 Success Criteria

Phase 1 is ✅ **COMPLETE** when:

### Database:
- [x] 39 tables created in Neon
- [x] Can insert users
- [x] Can insert businesses
- [x] Foreign keys work
- [x] UUIDs generate correctly

### Backend:
- [x] Auth endpoint creates users
- [x] Profile status returns data
- [x] Profile switching works
- [x] Business setup creates profile
- [x] BBT tokens awarded

### Frontend:
- [x] Login modal works
- [x] Can switch profiles
- [x] Business wizard completes
- [x] Settings page loads
- [x] No console errors

### Integration:
- [x] localStorage syncs with API
- [x] userId sent with requests
- [x] Middleware validates users
- [x] Database persists data
- [x] UI reflects database state

---

## 🚀 Ready for Phase 2?

**YES** if all tests pass! ✅

**NO** if any critical test fails! ❌

### Before Phase 2:
1. ✅ All database tests pass
2. ✅ All API tests pass
3. ✅ All UI tests pass
4. ✅ No console errors
5. ✅ Data persists correctly

### Optional Enhancements:
- [ ] Add error boundaries
- [ ] Add loading states
- [ ] Add optimistic updates
- [ ] Add rate limiting
- [ ] Add logging
- [ ] Add health check

**These can be done in Phase 2!**

---

## 📝 Test Results Template

```markdown
## Phase 1 Test Results

**Date**: 2026-02-04
**Tester**: [Your Name]

### Database Tests:
- [ ] Schema pushed: PASS/FAIL
- [ ] Tables exist: PASS/FAIL
- [ ] Can insert data: PASS/FAIL

### API Tests:
- [ ] Login creates user: PASS/FAIL
- [ ] Get profile status: PASS/FAIL
- [ ] Switch profile: PASS/FAIL
- [ ] Get feed: PASS/FAIL
- [ ] Get businesses: PASS/FAIL

### UI Tests:
- [ ] Landing page: PASS/FAIL
- [ ] Login modal: PASS/FAIL
- [ ] Login works: PASS/FAIL
- [ ] Feed page: PASS/FAIL
- [ ] Settings page: PASS/FAIL
- [ ] Profile switcher: PASS/FAIL

### Overall Status: PASS/FAIL

**Notes**:
[Any issues encountered]

**Screenshots**:
[Attach if helpful]
```

---

**Phase 1 is ready for thorough testing!** 🎉

Run through this checklist and document results before moving to Phase 2.
