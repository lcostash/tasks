# 🚀 How to Start TaskFlow

## The Problem
You're seeing a blank page because:
1. ❌ Laravel server is not running
2. ❌ Vite dev server is not running (React assets)

## The Solution

### Option 1: Easy Way (One Command) ⭐

Open a terminal in the project folder and run:

```bash
composer dev
```

This starts ALL services:
- Laravel server (http://localhost:8000)
- Vite dev server (React assets)
- Queue worker (for emails)
- Log viewer

### Option 2: Manual Way (3 Terminals)

**Terminal 1 - Laravel Server:**
```bash
cd /Users/lcostash/Domains/cursor/tasks
php artisan serve
```
Wait until you see: "Server running on [http://127.0.0.1:8000]"

**Terminal 2 - Vite Dev Server:**
```bash
cd /Users/lcostash/Domains/cursor/tasks
npm run dev
```
Wait until you see: "VITE ready in XXXms"

**Terminal 3 - Queue Worker (for OTP emails):**
```bash
cd /Users/lcostash/Domains/cursor/tasks
php artisan queue:work
```

## ✅ Access the App

Once both servers are running, open your browser to:

👉 **http://localhost:8000** 👈

(NOT just "http://localhost" - you need the :8000 port!)

## 🎯 What You Should See

✅ Beautiful landing page with blue and white design  
✅ "TaskFlow" logo in the header  
✅ "Login" button in the top right  
✅ Hero section with "Organize Your Work, Achieve Your Goals"  
✅ Features section with icons  

## 🐛 Troubleshooting

### Still seeing blank page?

1. **Check browser console** (Press F12, go to Console tab)
   - Look for red error messages
   - If you see errors about "Vite", make sure Vite is running

2. **Check Network tab** (F12 → Network)
   - Refresh the page
   - Look for `app.jsx` - should be status 200 (green)
   - If it's 404 or red, Vite isn't running

3. **Clear browser cache**
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

### Port 8000 already in use?

If you get "Address already in use", kill existing PHP processes:

```bash
# macOS/Linux
killall php

# Or find and kill specific process
lsof -ti:8000 | xargs kill -9
```

Then start again.

### Assets not loading?

Run:
```bash
npm install
npm run dev
```

## 📝 Quick Check

Everything working? Try to:
1. ✅ See the landing page
2. ✅ Click "Login" button → should go to OTP login form
3. ✅ Enter email: `admin@taskflow.com`
4. ✅ Should see "Check your email" message

---

**Need help?** Check the terminal output for error messages!

