# BBroker - Development Session Tracker

## How to Use This Tracker

1. Open a new Claude session
2. Reference the session number you want to work on
3. Upload the project ZIP
4. Say: "Let's implement Session X from the tracker"
5. Claude will guide you through that specific task
6. After completion, download updated files
7. Test locally
8. Git commit
9. Move to next session

---

## 📊 Progress Dashboard

| Phase | Sessions | Status | Completion |
|-------|----------|--------|------------|
| Phase 1: Foundation | 1-8 | 🔵 Pending | 0/8 |
| Phase 2: Profile Switching | 9-16 | ⚪ Not Started | 0/8 |
| Phase 3: User Features | 17-28 | ⚪ Not Started | 0/12 |
| Phase 4: Business Features | 29-38 | ⚪ Not Started | 0/10 |
| Phase 5: Payments & Wallet | 39-46 | ⚪ Not Started | 0/8 |
| Phase 6: Real-time | 47-52 | ⚪ Not Started | 0/6 |
| Phase 7: Polish | 53-58 | ⚪ Not Started | 0/6 |

**Legend**: ⚪ Not Started | 🔵 In Progress | ✅ Complete | ❌ Blocked

---

# PHASE 1: FOUNDATION (Sessions 1-8)

## Session 1: Database Schema Migration
**Duration**: 30 min | **Complexity**: ⭐ Low | **Status**: 🔵

### Pre-requisites:
- PostgreSQL running locally or cloud
- DATABASE_URL in .env file

### Files to Create/Modify:
```
MODIFY: shared/schema.ts
```

### What You'll Say to Claude:
```
"I want to implement Session 1: Database Schema Migration from the tracker. 
Here's my current schema.ts file. Please help me integrate the complete 
schema from schema-complete.ts without breaking existing functionality."
```

### Steps:
1. ✅ Backup current `shared/schema.ts` → `shared/schema-backup.ts`
2. ✅ Copy all table definitions from `schema-complete.ts`
3. ✅ Keep existing exports that other files use
4. ✅ Add new exports for new tables
5. ✅ Update `drizzle.config.ts` if needed
6. ✅ Run `npm run db:push` to migrate
7. ✅ Verify all tables created in database

### Validation Checklist:
- [ ] No TypeScript errors
- [ ] Server starts: `npm run dev`
- [ ] Database has 40+ tables
- [ ] Existing routes still work

### Git Commit:
```bash
git add shared/schema.ts
git commit -m "feat: Migrate to complete database schema with 40+ tables

- Added all social features tables (follows, likes, saves, shares)
- Added wishlist/boards (Pinterest-style)
- Added messaging system tables
- Added booking & appointment tables
- Added BBT token system (wallets, transactions)
- Added reviews, campaigns, analytics tables
- Added admin & moderation tables
- Backward compatible with existing code"
```

### Rollback Plan:
```bash
# If something breaks:
git checkout shared/schema-backup.ts
mv shared/schema-backup.ts shared/schema.ts
npm run db:push
```

### Screenshot to Take:
- Database viewer showing all tables
- Terminal showing successful migration
- Server running without errors

---

## Session 2: API Client Setup
**Duration**: 25 min | **Complexity**: ⭐ Low | **Status**: ⚪

### Files to Create:
```
CREATE: client/src/lib/api.ts
CREATE: client/src/lib/constants.ts
```

### What You'll Say to Claude:
```
"Let's implement Session 2: API Client Setup. I need a centralized API 
client with axios that handles authentication, error handling, and retry logic."
```

### Steps:
1. ✅ Install axios: `npm install axios`
2. ✅ Create `client/src/lib/api.ts` with axios instance
3. ✅ Add request interceptor (attach auth token)
4. ✅ Add response interceptor (handle errors)
5. ✅ Create `client/src/lib/constants.ts` with API endpoints
6. ✅ Test with existing endpoint

### Key Features:
- Base URL from environment
- Auto-attach Authorization header
- Handle 401 (redirect to login)
- Retry failed requests (3x)
- Global error handling

### Validation:
- [ ] Can make GET request to /api/user
- [ ] Auth token attached automatically
- [ ] Error toast shows on failure
- [ ] No console errors

### Git Commit:
```bash
git add client/src/lib/api.ts client/src/lib/constants.ts
git commit -m "feat: Add centralized API client with error handling"
```

---

## Session 3: Profile Switch Hook (Backend)
**Duration**: 35 min | **Complexity**: ⭐⭐ Medium | **Status**: ⚪

### Files to Create:
```
CREATE: server/controllers/profile.controller.ts
MODIFY: server/routes.ts
```

### What You'll Say to Claude:
```
"Let's implement Session 3: Profile Switch Backend Controller. I need the 
three endpoints: getProfileStatus, switchProfile, and createBusinessProfile."
```

### Steps:
1. ✅ Create `server/controllers/profile.controller.ts`
2. ✅ Implement `getProfileStatus` method
3. ✅ Implement `switchProfile` method
4. ✅ Implement `createBusinessProfile` method
5. ✅ Add routes to `server/routes.ts`
6. ✅ Test with Postman/Thunder Client

### Endpoints to Add:
```
GET    /api/users/profile-status
POST   /api/users/switch-profile
POST   /api/businesses/setup
```

### Validation:
- [ ] GET profile-status returns current state
- [ ] POST switch-profile changes user.currentProfile
- [ ] POST businesses/setup creates business
- [ ] Returns proper error messages

### Git Commit:
```bash
git add server/controllers/profile.controller.ts server/routes.ts
git commit -m "feat: Add profile switching backend endpoints"
```

---

## Session 4: Profile Switch Hook (Frontend)
**Duration**: 30 min | **Complexity**: ⭐⭐ Medium | **Status**: ⚪

### Files to Create:
```
CREATE: client/src/hooks/use-profile-switch.ts
```

### What You'll Say to Claude:
```
"Session 4: Create the use-profile-switch hook that connects to the 
backend endpoints we just created."
```

### Steps:
1. ✅ Create `client/src/hooks/use-profile-switch.ts`
2. ✅ Use TanStack Query for data fetching
3. ✅ Implement `useQuery` for profile status
4. ✅ Implement `useMutation` for switching
5. ✅ Add loading and error states
6. ✅ Test in a component

### Hook Functions:
- `currentProfile` - Current active profile
- `hasBusinessProfile` - Boolean flag
- `switchProfile(type)` - Switch function
- `isLoading` - Loading state
- `isSwitching` - Switching in progress

### Validation:
- [ ] Hook returns profile data
- [ ] Can switch profiles
- [ ] Loading states work
- [ ] Error handling works

### Git Commit:
```bash
git add client/src/hooks/use-profile-switch.ts
git commit -m "feat: Add profile switching frontend hook"
```

---

## Session 5: Settings Page (Basic)
**Duration**: 40 min | **Complexity**: ⭐⭐ Medium | **Status**: ⚪

### Files to Create:
```
CREATE: client/src/pages/SettingsPage.tsx
MODIFY: client/src/App.tsx (add route)
```

### What You'll Say to Claude:
```
"Session 5: Create a basic Settings page with just Account settings 
and the Profile Switch option for now. We'll add more sections later."
```

### Steps:
1. ✅ Create `client/src/pages/SettingsPage.tsx`
2. ✅ Add sections: Account, Profile Switch
3. ✅ Use shadcn/ui components
4. ✅ Add route in `App.tsx`
5. ✅ Add navigation link
6. ✅ Style with Tailwind

### Sections to Include:
- Header with title
- Account section (name, email - read only for now)
- Profile switch button
- Logout button

### Validation:
- [ ] Page accessible at /settings
- [ ] Shows current user info
- [ ] Profile switch button visible
- [ ] Responsive design

### Git Commit:
```bash
git add client/src/pages/SettingsPage.tsx client/src/App.tsx
git commit -m "feat: Add basic Settings page with profile switch"
```

---

## Session 6: Profile Switch Modal
**Duration**: 45 min | **Complexity**: ⭐⭐ Medium | **Status**: ⚪

### Files to Create:
```
CREATE: client/src/components/ProfileSwitchModal.tsx
MODIFY: client/src/pages/SettingsPage.tsx
```

### What You'll Say to Claude:
```
"Session 6: Create the ProfileSwitchModal component that shows two cards 
(User and Business) and handles switching between them."
```

### Steps:
1. ✅ Create `ProfileSwitchModal.tsx`
2. ✅ Design two-card layout
3. ✅ Show active/inactive states
4. ✅ Wire up to `use-profile-switch` hook
5. ✅ Add animations (Framer Motion)
6. ✅ Integrate into Settings page

### Modal Features:
- Two cards (User, Business)
- Active indicator badge
- Click to switch
- Loading state during switch
- Error handling

### Validation:
- [ ] Modal opens from Settings
- [ ] Shows correct active profile
- [ ] Can switch between profiles
- [ ] Smooth animations
- [ ] Closes after switch

### Git Commit:
```bash
git add client/src/components/ProfileSwitchModal.tsx
git commit -m "feat: Add profile switch modal UI component"
```

---

## Session 7: Business Setup Step 1-3
**Duration**: 50 min | **Complexity**: ⭐⭐⭐ High | **Status**: ⚪

### Files to Create:
```
CREATE: client/src/components/BusinessSetupWizard.tsx
CREATE: client/src/components/setup-steps/StepBusinessName.tsx
CREATE: client/src/components/setup-steps/StepDescription.tsx
CREATE: client/src/components/setup-steps/StepLocation.tsx
```

### What You'll Say to Claude:
```
"Session 7: Create the BusinessSetupWizard shell and the first 3 steps: 
Business Name, Description, and Location (with Google Maps integration)."
```

### Steps:
1. ✅ Create wizard shell with progress bar
2. ✅ Create Step 1: Business Name component
3. ✅ Create Step 2: Description component
4. ✅ Create Step 3: Location component
5. ✅ Add Google Maps API integration
6. ✅ Wire up navigation (Back/Next)

### Step 3 Features:
- Google Maps integration
- Current location detection
- Draggable pin
- Address autocomplete
- Paste Google Maps link option

### Validation:
- [ ] Wizard opens
- [ ] Progress bar updates
- [ ] Can enter business name
- [ ] Can enter description
- [ ] Maps loads and works
- [ ] Can select location
- [ ] Back/Next navigation works

### Git Commit:
```bash
git add client/src/components/BusinessSetupWizard.tsx
git add client/src/components/setup-steps/
git commit -m "feat: Add business setup wizard (steps 1-3)"
```

---

## Session 8: Business Setup Step 4-6
**Duration**: 50 min | **Complexity**: ⭐⭐⭐ High | **Status**: ⚪

### Files to Create:
```
CREATE: client/src/components/setup-steps/StepWorkingHours.tsx
CREATE: client/src/components/setup-steps/StepCategories.tsx
CREATE: client/src/components/setup-steps/StepTargetAudience.tsx
MODIFY: client/src/components/BusinessSetupWizard.tsx
```

### What You'll Say to Claude:
```
"Session 8: Complete the business setup wizard with steps 4-6: Working Hours, 
Categories, and Target Audience. Then wire up the submit function."
```

### Steps:
1. ✅ Create Step 4: Working Hours component
2. ✅ Create Step 5: Categories component
3. ✅ Create Step 6: Target Audience component
4. ✅ Add form submission logic
5. ✅ Add success animation
6. ✅ Test complete flow

### Step 5 Features:
- Searchable dropdown
- Main category (required)
- 3 affiliate categories (optional)
- Alphabetically sorted list

### Validation:
- [ ] All 6 steps work
- [ ] Can complete entire wizard
- [ ] Form submits to backend
- [ ] Business created successfully
- [ ] BBT tokens awarded
- [ ] Redirects to business dashboard
- [ ] Profile switched automatically

### Git Commit:
```bash
git add client/src/components/setup-steps/
git add client/src/components/BusinessSetupWizard.tsx
git commit -m "feat: Complete business setup wizard (steps 4-6)

- Add working hours selector
- Add category selection (main + 3 affiliates)
- Add target audience configuration
- Wire up form submission
- Add BBT reward (420 tokens)
- Complete setup flow end-to-end"
```

---

# 🎯 CHECKPOINT: Phase 1 Complete!

After Session 8, you should have:
✅ Complete database schema
✅ API client infrastructure
✅ Profile switching backend
✅ Profile switching frontend
✅ Settings page
✅ Profile switch modal
✅ Complete business setup wizard

**Test Everything:**
```bash
# Start the app
npm run dev

# Test flow:
1. Login as user
2. Go to Settings
3. Click "Switch Profile"
4. Select Business (first time)
5. Complete 6-step wizard
6. Verify business created
7. See business dashboard
8. Switch back to user
9. Switch to business again (instant)
```

**Take Screenshots:**
1. Settings page
2. Profile switch modal
3. Each step of wizard
4. Completed business profile
5. Business dashboard

**Git Tag:**
```bash
git tag -a v0.1.0-phase1-complete -m "Phase 1: Foundation complete"
git push origin v0.1.0-phase1-complete
```

---

# PHASE 2: PROFILE SWITCHING POLISH (Sessions 9-16)

## Session 9: Conditional Navigation
**Duration**: 30 min | **Complexity**: ⭐⭐ Medium

### What You'll Say to Claude:
```
"Session 9: Make the bottom navigation conditional based on current profile. 
Show BottomNav for user mode, BusinessBottomNav for business mode."
```

### Files to Modify:
```
MODIFY: client/src/App.tsx
```

### Steps:
1. ✅ Import `use-profile-switch` hook in App.tsx
2. ✅ Get `currentProfile` value
3. ✅ Conditionally render navigation
4. ✅ Test switching updates nav

### Validation:
- [ ] User mode shows: Feed, Map, Post, Favorites, Menu
- [ ] Business mode shows: Dashboard, Analytics, Post, Inbox, Customers
- [ ] Nav updates immediately after switch

---

## Session 10: Business Dashboard (Basic)
**Duration**: 40 min | **Complexity**: ⭐⭐ Medium

### What You'll Say to Claude:
```
"Session 10: Enhance BusinessDashboard.tsx to show the business info 
we just created, and add placeholder widgets for stats."
```

### Files to Modify:
```
MODIFY: client/src/pages/BusinessDashboard.tsx
```

### Steps:
1. ✅ Fetch business profile data
2. ✅ Display business name, category, location
3. ✅ Add stat widgets (views, followers, revenue)
4. ✅ Add quick actions section
5. ✅ Style with cards

---

## Session 11: Wallet Backend
**Duration**: 45 min | **Complexity**: ⭐⭐⭐ High

### What You'll Say to Claude:
```
"Session 11: Create the BBT wallet backend. I need wallet creation, 
token transactions, and balance tracking."
```

### Files to Create:
```
CREATE: server/controllers/wallet.controller.ts
CREATE: server/services/token.service.ts
MODIFY: server/routes.ts
```

### Features:
- Auto-create wallet on user registration
- Award tokens function
- Deduct tokens function
- Get balance
- Get transaction history

---

## Session 12: Wallet Hook
**Duration**: 30 min | **Complexity**: ⭐⭐ Medium

### What You'll Say to Claude:
```
"Session 12: Create use-wallet hook for the frontend to interact 
with the wallet backend."
```

### Files to Create:
```
CREATE: client/src/hooks/use-wallet.ts
```

---

## Session 13: Wallet Page
**Duration**: 45 min | **Complexity**: ⭐⭐ Medium

### What You'll Say to Claude:
```
"Session 13: Enhance the Wallet page to show BBT balance, recent 
transactions, and earning breakdown."
```

### Files to Modify:
```
MODIFY: client/src/pages/Wallet.tsx
```

---

## Session 14: BBT Rewards Integration
**Duration**: 40 min | **Complexity**: ⭐⭐⭐ High

### What You'll Say to Claude:
```
"Session 14: Wire up automatic BBT rewards for key actions like 
profile completion, first post, etc."
```

### Files to Modify:
```
MODIFY: server/controllers/profile.controller.ts (award on business setup)
MODIFY: server/controllers/user.controller.ts (award on profile complete)
```

---

## Session 15: Token Balance Widget
**Duration**: 35 min | **Complexity**: ⭐⭐ Medium

### What You'll Say to Claude:
```
"Session 15: Create a BBTBalanceWidget component to show in header/nav."
```

### Files to Create:
```
CREATE: client/src/components/BBTBalanceWidget.tsx
MODIFY: client/src/components/Header.tsx
```

---

## Session 16: Profile Switch Testing
**Duration**: 30 min | **Complexity**: ⭐ Low

### What You'll Say to Claude:
```
"Session 16: Help me create comprehensive tests for the profile 
switching system."
```

### What to Test:
- User registration
- Profile completion (earns 130 BBT)
- Switch to business (triggers wizard)
- Complete wizard (earns 420 BBT)
- Wallet shows 550 BBT total
- Switch back to user
- Switch to business (instant)
- Business data persists

---

# 📸 Memory Management Strategy

## How to Keep Context Across Sessions:

### 1. **Project State Document**
After each session, update a `PROJECT_STATE.md`:

```markdown
# BBroker - Current State

## Last Updated: 2026-02-01

## Completed Sessions: 8/58

### What's Working:
✅ Database schema (40+ tables)
✅ Profile switching (backend + frontend)
✅ Business setup wizard (all 6 steps)
✅ Settings page
✅ BBT wallet (basic)

### What's Next:
🔵 Session 9: Conditional navigation
🔵 Session 10: Business dashboard

### Known Issues:
- None yet

### Environment Variables Needed:
- DATABASE_URL=postgresql://...
- GOOGLE_MAPS_API_KEY=...
```

### 2. **Session Screenshots**
Organize screenshots like this:
```
/screenshots/
  /session-01-database/
    - all-tables.png
    - migration-success.png
  /session-06-profile-modal/
    - user-card.png
    - business-card.png
    - switching-animation.gif
  /session-08-wizard-complete/
    - step-1-name.png
    - step-2-description.png
    - step-3-location.png
    - step-4-hours.png
    - step-5-categories.png
    - step-6-audience.png
    - success.png
```

### 3. **Git Commit History as Memory**
Each commit message is a breadcrumb:
```bash
git log --oneline
```

### 4. **Session Notes Template**
Keep a `SESSIONS.md` file:

```markdown
## Session 1 - 2026-02-01
- **Duration**: 25 min
- **Task**: Database schema migration
- **Result**: ✅ Success
- **Files Changed**: shared/schema.ts
- **Git Commit**: 5de859d
- **Notes**: Took 3 migration attempts, had to fix foreign key references
- **BBT Earned**: N/A

## Session 2 - 2026-02-01
...
```

---

## 🎯 Tips for Using Claude Free Plan Effectively

### 1. **One Session = One Focused Task**
Don't try to do sessions 1-5 in one go. Each session should be:
- 25-50 minutes
- 1-3 files modified
- Testable outcome
- Git committable

### 2. **Start Each Session With Context**
```
"Hi Claude! I'm working on BBroker (local business marketplace app).

Current State: I've completed sessions 1-8 (foundation phase). 
Database is set up, profile switching works.

Today's Goal: Session 9 - Make navigation conditional based on profile.

Please help me modify App.tsx to show different bottom nav 
for user vs business mode."
```

### 3. **Ask for Incremental Code**
Instead of:
❌ "Build the entire wallet system"

Do this:
✅ "Let's create the wallet backend controller first. Just the 
   getBalance and getTransactions methods. We'll add 
   cashOut in the next session."

### 4. **Use Checkpoints**
Every 4-5 sessions, test everything:
```
Checkpoint 1: After Session 8 (Foundation)
Checkpoint 2: After Session 16 (Profile Switching)
Checkpoint 3: After Session 28 (User Features)
...
```

### 5. **Keep Files Organized**
```
/documentation/
  - SESSION_TRACKER.md (this file)
  - PROJECT_STATE.md (current state)
  - SESSIONS.md (session notes)
  - ISSUES.md (bugs found)
  
/screenshots/
  - /session-XX/

/backups/
  - pre-session-XX-backup.zip (before major changes)
```

---

## 🚨 If Something Breaks

### Recovery Steps:
1. **Don't panic** - everything is in git
2. **Check what changed**: `git status`
3. **See recent commits**: `git log --oneline -5`
4. **Revert if needed**: `git revert HEAD`
5. **Or restore file**: `git checkout -- path/to/file.ts`
6. **Ask Claude for help**: 
   ```
   "I tried to implement X but now Y is broken. 
   Here's the error: [paste error]
   Last working commit: abc123
   Can you help me fix this?"
   ```

---

## 📊 Tracking Progress

Create a simple spreadsheet or use this markdown:

```markdown
| Session | Task | Status | Time | Issues | BBT Feature |
|---------|------|--------|------|--------|-------------|
| 1 | Database Schema | ✅ | 30m | None | - |
| 2 | API Client | ✅ | 25m | None | - |
| 3 | Profile Backend | ✅ | 35m | None | - |
| 4 | Profile Hook | ✅ | 30m | None | - |
| 5 | Settings Page | ✅ | 40m | None | - |
| 6 | Switch Modal | ✅ | 45m | None | - |
| 7 | Wizard Steps 1-3 | ✅ | 50m | Maps API key | - |
| 8 | Wizard Steps 4-6 | ✅ | 50m | None | ✅ Awards 420 BBT |
| 9 | Conditional Nav | 🔵 | - | - | - |
```

---

## 🎉 Motivation Tracker

Set mini-goals with rewards:

```markdown
After Session 8: 🎉 Pizza time! Profile switching works!
After Session 16: 🎉 Movie night! Phase 2 complete!
After Session 28: 🎉 Day off! User features done!
After Session 58: 🎉 Launch party! App is live!
```

---

This SESSION_TRACKER.md will be your bible for incremental development! 🚀

Would you like me to start with Session 1 right now?
