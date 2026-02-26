# API 404 Error Fix Instructions

The 404 error occurs because the Angular dev server (port 4200) doesn't have your backend API. Here are the solutions:

## ✅ QUICK FIX (Recommended)

### 1. Start Your Backend Server
Make sure your backend API server is running on the expected port (default: 3000).

### 2. Restart Angular Dev Server
```bash
# Stop the current dev server (Ctrl+C)
# Restart with proxy configuration
ng serve
```

The proxy configuration will automatically forward `/api/*` requests to your backend.

## 🔧 DETAILED SOLUTIONS

### Option A: Use Proxy Configuration (Recommended for Development)
1. Backend server running on `http://localhost:3000`
2. Angular dev server with proxy forwards API calls
3. API calls go to: `http://localhost:4200/api/v1/users/{id}` → `http://localhost:3000/api/v1/users/{id}`

### Option B: Direct Backend URL
Update `api.config.ts` to use direct backend URL:
```typescript
BASE_URL: 'http://localhost:3000' // Change from '' to full URL
```

### Option C: Different Backend Port
If your backend runs on a different port, update `proxy.conf.json`:
```json
{
  "/api/*": {
    "target": "http://localhost:8080", // Your backend port
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

## 🚀 VERIFY THE FIX

1. Check browser console for successful API calls
2. Verify backend server is running
3. Test profile update functionality

## 🐛 COMMON ISSUES

**Backend not running**: Start your backend server first
**Wrong port**: Update proxy.conf.json with correct port
**CORS issues**: Ensure backend allows requests from localhost:4200
**Wrong endpoint**: Check if your backend uses `/api/users/{id}` instead of `/api/v1/users/{id}`

## 📋 CHECKLIST

- [ ] Backend server is running
- [ ] Correct port in proxy.conf.json
- [ ] Angular dev server restarted
- [ ] API endpoint matches backend route
- [ ] No CORS errors in browser console
