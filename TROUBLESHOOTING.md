# Payo Admin Dashboard - Troubleshooting Guide

## Common Errors and Solutions

### ❌ Error: "Cannot read properties of undefined (toFixed)"

**Fixed!** This was caused by missing null checks when API data was undefined.

**What was fixed:**
- Added null coalescing operators (`??`) for number operations
- Added default values for all API responses
- Added proper error handling in React Query
- Added defensive checks for array operations

**Now the app will:**
- Show `0` instead of crashing when data is missing
- Display empty arrays instead of undefined
- Show helpful error messages

---

### ❌ Error: "Failed to load dashboard data"

**Cause:** Backend services not running or not accessible

**Solution:**

1. **Check if backend services are running:**
   ```bash
   cd /Users/umashankar.pathak/Documents/Learn_Node/project/payo-backend
   pm2 list
   ```

2. **Verify all services are online:**
   - ✅ api-gateway (port 3000)
   - ✅ auth-service (port 3001)
   - ✅ admin-service (port 3010)

3. **Start missing services:**
   ```bash
   pm2 restart all
   ```

4. **Check service health:**
   ```bash
   curl http://localhost:3000/health
   curl http://localhost:3001/health
   curl http://localhost:3010/health
   ```

---

### ❌ Error: "401 Unauthorized" or Token Errors

**Cause:** Authentication token expired or invalid

**Solutions:**

1. **Clear browser storage and login again:**
   - Open DevTools (F12)
   - Go to Application tab
   - Clear Local Storage
   - Refresh and login

2. **Or use incognito mode:**
   - Open http://localhost:5173 in incognito
   - Login fresh

3. **Check if auth-service is running:**
   ```bash
   pm2 logs auth-service --lines 20
   ```

---

### ❌ Error: Network Error / CORS Error

**Cause:** API calls being blocked by CORS or services not reachable

**Solutions:**

1. **Check .env.development:**
   ```bash
   cat .env.development
   ```
   Should have:
   ```
   VITE_API_BASE_URL=http://localhost:3000
   VITE_AUTH_SERVICE_URL=http://localhost:3001
   VITE_ADMIN_SERVICE_URL=http://localhost:3010
   ```

2. **Verify backend CORS settings:**
   Backend services should allow `http://localhost:5173`

3. **Check if ports are accessible:**
   ```bash
   curl -v http://localhost:3000/health
   curl -v http://localhost:3001/health
   curl -v http://localhost:3010/health
   ```

---

### ❌ Error: "Cannot find module" or Build Errors

**Cause:** Missing dependencies or corrupted node_modules

**Solutions:**

1. **Clean install:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Clear Vite cache:**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

3. **Check Node version:**
   ```bash
   node --version  # Should be 18+
   ```

---

### ❌ Empty Data / No Users/Merchants Showing

**Cause:** Database is empty or API endpoints not returning data

**Solutions:**

1. **Check MongoDB:**
   ```bash
   mongosh payo --eval "db.users.countDocuments()"
   mongosh payo --eval "db.merchants.countDocuments()"
   ```

2. **Check admin exists:**
   ```bash
   mongosh payo --eval "db.admins.findOne({email: 'admin@payo.com'})"
   ```

3. **Create test data:**
   Use the backend's test scripts or API to create test users/merchants

4. **Check API directly:**
   ```bash
   # Get token first
   TOKEN=$(curl -s -X POST http://localhost:3001/api/v1/admin/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@payo.com","password":"Admin@123456"}' \
     | jq -r '.accessToken')

   # Test users endpoint
   curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:3000/api/v1/admin/users
   ```

---

### ❌ TypeScript Errors in IDE

**Cause:** Route types not generated or out of sync

**Solutions:**

1. **Regenerate route tree:**
   ```bash
   npm run dev
   # Routes will auto-generate
   ```

2. **Restart TypeScript server:**
   - In VS Code: Cmd+Shift+P → "Restart TS Server"

3. **Check routeTree.gen.ts exists:**
   ```bash
   ls -la src/routeTree.gen.ts
   ```

---

### ❌ Dev Server Won't Start

**Cause:** Port already in use or other Vite instance running

**Solutions:**

1. **Kill existing processes:**
   ```bash
   pkill -f "vite"
   lsof -ti:5173 | xargs kill -9
   ```

2. **Use different port:**
   ```bash
   npm run dev -- --port 5174
   ```

3. **Check port availability:**
   ```bash
   lsof -i:5173
   ```

---

## Quick Debug Checklist

Before reporting issues, check:

- [ ] All backend services running (`pm2 list`)
- [ ] MongoDB running (`mongosh --eval "db.version()"`)
- [ ] Redis running (if used)
- [ ] Environment variables correct (`.env.development`)
- [ ] Browser console for errors (F12)
- [ ] Network tab shows API calls (F12 → Network)
- [ ] Local storage has auth tokens (F12 → Application)

---

## Detailed Debugging Steps

### 1. Check Backend Services

```bash
# Check all services
pm2 list

# Check specific service logs
pm2 logs admin-service --lines 50
pm2 logs api-gateway --lines 50
pm2 logs auth-service --lines 50

# Restart if needed
pm2 restart all
```

### 2. Test API Endpoints Manually

```bash
# Login and get token
curl -X POST http://localhost:3001/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@payo.com",
    "password": "Admin@123456"
  }'

# Should return: { accessToken, refreshToken, admin }
```

### 3. Check Browser Console

Open DevTools (F12) and look for:
- Red error messages
- Failed network requests
- Authentication errors
- CORS errors

### 4. Check Network Tab

1. Open DevTools (F12) → Network tab
2. Refresh the page
3. Look for failed requests (red)
4. Click on failed requests to see:
   - Request headers
   - Response status
   - Error messages

### 5. Check Application Storage

1. Open DevTools (F12) → Application tab
2. Local Storage → http://localhost:5173
3. Verify:
   - `payo_admin_tokens` exists
   - `payo_admin_data` exists
4. If corrupted, clear and login again

---

## Backend Service Health Checks

### Quick Health Check Script

```bash
#!/bin/bash
echo "Checking Payo Backend Services..."
echo ""

echo "API Gateway (3000):"
curl -s http://localhost:3000/health | jq .
echo ""

echo "Auth Service (3001):"
curl -s http://localhost:3001/health | jq .
echo ""

echo "Admin Service (3010):"
curl -s http://localhost:3010/health | jq .
echo ""

echo "MongoDB:"
mongosh --quiet --eval "db.adminCommand('ping')" payo
```

Save as `check-services.sh` and run:
```bash
chmod +x check-services.sh
./check-services.sh
```

---

## Still Having Issues?

### Get Detailed Logs

```bash
# Frontend console
# Open browser DevTools → Console

# Backend logs
pm2 logs --lines 100

# Specific service logs
pm2 logs admin-service --lines 50
pm2 logs api-gateway --lines 50
```

### Clear Everything and Start Fresh

```bash
# Stop frontend
pkill -f "vite"

# Clean install frontend
rm -rf node_modules package-lock.json
npm install

# Restart backend
cd /Users/umashankar.pathak/Documents/Learn_Node/project/payo-backend
pm2 restart all

# Wait 5 seconds
sleep 5

# Start frontend
cd /Users/umashankar.pathak/Documents/Learn_Node/project/payo-admin
npm run dev
```

### Check System Resources

```bash
# Check if ports are available
lsof -i:3000  # API Gateway
lsof -i:3001  # Auth Service
lsof -i:3010  # Admin Service
lsof -i:5173  # Frontend

# Check MongoDB
mongosh --eval "db.version()"
```

---

## Contact Support

If none of these solutions work:

1. **Gather information:**
   - Browser console errors
   - Network tab failed requests
   - Backend service logs
   - Environment variables

2. **Check documentation:**
   - README.md
   - PROJECT_SUMMARY.md
   - QUICK_START.md

3. **Common fixes usually work:**
   - Restart all services
   - Clear browser cache
   - Fresh login
   - Check environment variables

---

## Tips for Smooth Development

1. **Keep backend running:** Don't stop backend services while developing frontend
2. **Watch for hot reload:** Vite should auto-reload on file changes
3. **Check console regularly:** Catch errors early
4. **Use React DevTools:** Install React Developer Tools browser extension
5. **Monitor PM2:** Keep an eye on `pm2 monit`

---

**Remember:** Most errors are due to:
- Backend services not running
- Wrong environment variables
- Expired auth tokens
- Empty database

Check these first! ✅
