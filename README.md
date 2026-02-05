# BBroker - Local Business Marketplace

**Version**: 1.0.0  
**Status**: Phase 1 Complete ✅  
**Database**: Neon PostgreSQL (Pre-configured)  

---

## 🚀 QUICK START (5 Minutes)

### Prerequisites:
- Node.js 18+ ([Download](https://nodejs.org/))
- npm 9+ (comes with Node.js)

### Setup Commands:

```bash
# 1. Install dependencies (2-3 minutes)
npm install

# 2. Start development server
npm run dev
```

**Open browser**: http://localhost:5000

**That's it!** 🎉

---

## ✅ What's Pre-Configured

- ✅ **Database**: Neon PostgreSQL connection in `.env`
- ✅ **Port**: Set to 5000 (avoids conflicts)
- ✅ **Schema**: 39 tables ready to push
- ✅ **Code**: All bugs fixed, validation passing
- ✅ **Environment**: `.env` file configured

---

## 📋 Full Setup

```bash
# Install dependencies
npm install

# Push database schema (creates tables)
npm run db:push

# Start development
npm run dev

# Open browser
# http://localhost:5000
```

---

## 🎯 Features (Phase 1 Complete)

- ✅ Authentication (Login/Register)
- ✅ Profile Switching (User ↔ Business)
- ✅ Business Setup Wizard (6 steps)
- ✅ Settings Page (8 sections)
- ✅ Database Integration (Neon PostgreSQL)
- ✅ Session Management
- ✅ Theme Switching (Light/Dark)

---

## 🗄️ Database

**Provider**: Neon PostgreSQL  
**Tables**: 39 (users, businesses, products, etc.)  
**Connection**: Already configured in `.env`

```bash
# Open visual database browser
npm run db:studio
```

---

## 🔧 Common Commands

```bash
npm run dev         # Start dev server
npm run db:studio   # Database browser
npm run check       # TypeScript check
npm run validate    # Validate imports
```

---

## 🐛 Troubleshooting

### Port already in use?
```bash
lsof -ti:5000 | xargs kill -9
npm run dev
```

### Missing dependencies?
```bash
npm install
```

**See TROUBLESHOOTING.md for complete guide**

---

## 📚 Documentation

- `IMMEDIATE_SETUP_FIX.md` - Setup guide
- `TROUBLESHOOTING.md` - Common issues
- `PHASE_1_COMPLETE_DOCUMENTATION.md` - Full docs

---

## 🎉 Test The App

1. Run `npm run dev`
2. Open http://localhost:5000
3. Click "Login"
4. Enter username: "testuser"
5. Success! ✅

---

**Everything is pre-configured and ready!**

**Just run: `npm install && npm run dev`**

🚀 Happy coding!
