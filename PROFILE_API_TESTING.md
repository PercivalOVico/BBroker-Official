# Profile Switching API - Testing Guide

## Endpoints Created

### 1. GET /api/users/profile-status
Get current profile status for authenticated user.

**Query Parameters:**
- `userId` (string, optional) - For testing without auth

**Response:**
```json
{
  "currentProfile": "user",
  "hasBusinessProfile": false,
  "businessProfile": null,
  "user": {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "profilePhoto": "https://..."
  }
}
```

**Testing with cURL:**
```bash
# Without auth (testing mode)
curl http://localhost:5000/api/users/profile-status?userId=YOUR_USER_ID

# With auth (production)
curl http://localhost:5000/api/users/profile-status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Testing with Thunder Client / Postman:**
```
GET http://localhost:5000/api/users/profile-status?userId=user-uuid-here
```

---

### 2. POST /api/users/switch-profile
Switch between user and business profile.

**Query Parameters:**
- `userId` (string, optional) - For testing without auth

**Request Body:**
```json
{
  "profileType": "business"
}
```

**Response (Success):**
```json
{
  "success": true,
  "currentProfile": "business",
  "message": "Switched to business profile"
}
```

**Response (No Business Profile):**
```json
{
  "error": "No Business Profile",
  "message": "No business profile found. Please complete business setup first.",
  "needsSetup": true
}
```

**Testing with cURL:**
```bash
curl -X POST http://localhost:5000/api/users/switch-profile?userId=YOUR_USER_ID \
  -H "Content-Type: application/json" \
  -d '{"profileType": "business"}'
```

**Testing with Thunder Client:**
```
POST http://localhost:5000/api/users/switch-profile?userId=user-uuid-here
Body (JSON):
{
  "profileType": "business"
}
```

---

### 3. POST /api/businesses/setup
Create business profile (6-step wizard completion).

**Query Parameters:**
- `userId` (string, optional) - For testing without auth

**Request Body:**
```json
{
  "businessName": "Mike's Coffee Shop",
  "description": "Cozy neighborhood coffee shop with fresh pastries",
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "address": "123 Main St, San Francisco, CA 94102",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94102",
    "country": "USA"
  },
  "workingHours": {
    "monday": { "open": true, "start": "07:00", "end": "19:00" },
    "tuesday": { "open": true, "start": "07:00", "end": "19:00" },
    "wednesday": { "open": true, "start": "07:00", "end": "19:00" },
    "thursday": { "open": true, "start": "07:00", "end": "19:00" },
    "friday": { "open": true, "start": "07:00", "end": "19:00" },
    "saturday": { "open": true, "start": "08:00", "end": "20:00" },
    "sunday": { "open": true, "start": "08:00", "end": "18:00" },
    "is24x7": false,
    "isByAppointment": false
  },
  "mainCategory": "Food & Beverage",
  "affiliateCategory1": "Bakery",
  "affiliateCategory2": null,
  "affiliateCategory3": null,
  "targetMarket": "local",
  "targetAgeRanges": ["18-25", "26-30", "31-35", "36-40"]
}
```

**Response (Success):**
```json
{
  "success": true,
  "business": {
    "id": "uuid",
    "userId": "uuid",
    "businessName": "Mike's Coffee Shop",
    "description": "...",
    "status": "pending_verification",
    "rating": "0",
    "createdAt": "2026-02-01T..."
  },
  "bbtAwarded": 420,
  "message": "Business profile created successfully"
}
```

**Testing with cURL:**
```bash
curl -X POST http://localhost:5000/api/businesses/setup?userId=YOUR_USER_ID \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Test Business",
    "description": "A test business",
    "location": {
      "latitude": 37.7749,
      "longitude": -122.4194,
      "address": "123 Test St",
      "city": "San Francisco",
      "state": "CA",
      "zip": "94102",
      "country": "USA"
    },
    "workingHours": {
      "monday": {"open": true, "start": "09:00", "end": "17:00"},
      "tuesday": {"open": true, "start": "09:00", "end": "17:00"},
      "wednesday": {"open": true, "start": "09:00", "end": "17:00"},
      "thursday": {"open": true, "start": "09:00", "end": "17:00"},
      "friday": {"open": true, "start": "09:00", "end": "17:00"},
      "saturday": {"open": false, "start": null, "end": null},
      "sunday": {"open": false, "start": null, "end": null},
      "is24x7": false,
      "isByAppointment": false
    },
    "mainCategory": "Technology",
    "targetMarket": "local",
    "targetAgeRanges": ["26-30", "31-35"]
  }'
```

---

## Complete Test Flow

### Step 1: Create a User
First, login or create a user (existing endpoint):

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser"}'
```

Save the returned `id` (user ID) for next steps.

### Step 2: Check Profile Status
```bash
curl http://localhost:5000/api/users/profile-status?userId=USER_ID_HERE
```

Expected: 
- `currentProfile`: "user"
- `hasBusinessProfile`: false
- `businessProfile`: null

### Step 3: Try to Switch to Business (Should Fail)
```bash
curl -X POST http://localhost:5000/api/users/switch-profile?userId=USER_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"profileType": "business"}'
```

Expected:
- Error: "No business profile found"
- `needsSetup`: true

### Step 4: Create Business Profile
```bash
curl -X POST http://localhost:5000/api/businesses/setup?userId=USER_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "My Test Shop",
    "description": "Testing business setup",
    "location": {
      "latitude": 37.7749,
      "longitude": -122.4194,
      "address": "123 Test St, SF, CA",
      "city": "San Francisco",
      "state": "CA",
      "zip": "94102",
      "country": "USA"
    },
    "workingHours": {
      "monday": {"open": true, "start": "09:00", "end": "17:00"},
      "tuesday": {"open": true, "start": "09:00", "end": "17:00"},
      "wednesday": {"open": true, "start": "09:00", "end": "17:00"},
      "thursday": {"open": true, "start": "09:00", "end": "17:00"},
      "friday": {"open": true, "start": "09:00", "end": "17:00"},
      "saturday": {"open": false, "start": null, "end": null},
      "sunday": {"open": false, "start": null, "end": null},
      "is24x7": false,
      "isByAppointment": false
    },
    "mainCategory": "Technology",
    "targetMarket": "local",
    "targetAgeRanges": ["26-30"]
  }'
```

Expected:
- `success`: true
- `bbtAwarded`: 420
- Business object returned
- User automatically switched to business profile

### Step 5: Check Profile Status Again
```bash
curl http://localhost:5000/api/users/profile-status?userId=USER_ID_HERE
```

Expected:
- `currentProfile`: "business"
- `hasBusinessProfile`: true
- `businessProfile`: { business object }

### Step 6: Switch Back to User
```bash
curl -X POST http://localhost:5000/api/users/switch-profile?userId=USER_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"profileType": "user"}'
```

Expected:
- `success`: true
- `currentProfile`: "user"

### Step 7: Switch to Business (Should Work Now)
```bash
curl -X POST http://localhost:5000/api/users/switch-profile?userId=USER_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"profileType": "business"}'
```

Expected:
- `success`: true
- `currentProfile`: "business"

---

## Error Scenarios

### 1. Missing Required Fields
```bash
curl -X POST http://localhost:5000/api/businesses/setup?userId=USER_ID \
  -H "Content-Type: application/json" \
  -d '{"businessName": "Test"}'
```

Expected: 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Missing required fields",
  "required": [...]
}
```

### 2. Invalid Profile Type
```bash
curl -X POST http://localhost:5000/api/users/switch-profile?userId=USER_ID \
  -H "Content-Type: application/json" \
  -d '{"profileType": "invalid"}'
```

Expected: 400 Bad Request

### 3. Business Already Exists
Try creating business twice with same user ID.

Expected: 400 Conflict

---

## Database Verification

After creating business, check database:

### Check User Updated:
```sql
SELECT id, username, current_profile, has_business_profile 
FROM users 
WHERE id = 'your-user-id';
```

Expected:
- `current_profile`: 'business'
- `has_business_profile`: true

### Check Business Created:
```sql
SELECT id, user_id, business_name, status, rating 
FROM businesses 
WHERE user_id = 'your-user-id';
```

Expected: One business record

### Check Wallet Created & Tokens Awarded:
```sql
SELECT * FROM wallets WHERE user_id = 'your-user-id';
```

Expected:
- `balance`: '420'
- `lifetime_earned`: '420'

```sql
SELECT * FROM token_transactions 
WHERE wallet_id = (SELECT id FROM wallets WHERE user_id = 'your-user-id');
```

Expected: One transaction record for 420 BBT

---

## Next Steps (Session 4)

Once these endpoints work, we'll create the frontend hook to use them:
- `useProfileSwitch()` hook
- React Query integration
- State management

The backend is ready! 🚀
