# Port 5000 Already in Use - Quick Fix

## Error Message:
```
Error: listen EADDRINUSE: address already in use 0.0.0.0:5000
```

## What This Means:
Another process is already running on port 5000.

---

## ✅ Solution 1: Use Different Port (EASIEST)

Edit the `.env` file and change the port:

```bash
# Open .env file
nano .env

# Change this line:
PORT=5000

# To this:
PORT=5001

# Save and exit (Ctrl+X, then Y, then Enter)
```

Then start the server:
```bash
npm run dev
```

Open: http://localhost:5001

---

## ✅ Solution 2: Kill Process on Port 5000

### On macOS/Linux:
```bash
lsof -ti:5000 | xargs kill -9
```

### On Windows:
```bash
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Then start normally:
```bash
npm run dev
```

---

## ✅ Solution 3: Find and Stop the Process

### Linux/macOS:
```bash
# Find what's using port 5000
lsof -i :5000

# Example output:
# COMMAND   PID  USER
# node    12345  username

# Kill it
kill -9 12345
```

### Or kill all node processes:
```bash
pkill -9 node
```

### Then:
```bash
npm run dev
```

---

## Quick Fix (One Command):

```bash
# Try to kill process, then start server
(lsof -ti:5000 | xargs kill -9 2>/dev/null || true) && npm run dev
```

---

## If Nothing Works:

Just use a different port:

```bash
PORT=5001 npm run dev
```

Or:
```bash
PORT=3000 npm run dev
```

---

## Permanent Fix:

Update `.env` file:
```
PORT=5001
```

This will make it use port 5001 by default.

---

**Recommendation**: Use port 5001 to avoid conflicts!
