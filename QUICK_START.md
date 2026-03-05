# Payo Admin Dashboard - Quick Start Guide

## Prerequisites

Make sure the Payo backend services are running:

```bash
# In payo-backend directory
pm2 list

# Should show all services running:
# - hardhat-node (port 8545)
# - auth-service (port 3001)
# - wallet-service (port 3002)
# - payment-service (port 3004)
# - merchant-service (port 3007)
# - admin-service (port 3010)
# - indexer-service (port 3006)
# - api-gateway (port 3000)
```

## Installation & Setup

```bash
# Navigate to payo-admin directory
cd /Users/umashankar.pathak/Documents/Learn_Node/project/payo-admin

# Dependencies are already installed, but if needed:
npm install

# Start the development server
npm run dev
```

The app will be available at: **http://localhost:5173**

## Login

Use these credentials:

- **Email**: `admin@payo.com`
- **Password**: `Admin@123456`

## Testing the Features

### 1. Dashboard
- View system metrics (users, merchants, transactions, volume)
- Check recent admin activity
- View payment statistics

### 2. Users Management
- Navigate to "Users" in the sidebar
- Search for users
- Click "..." menu to view details or block/unblock users

### 3. Merchants Management
- Navigate to "Merchants"
- Use tabs to filter by KYC status (All, Pending, Approved, Rejected)
- Click "..." menu to:
  - View merchant details
  - Approve/reject KYC
  - Activate/deactivate merchant

### 4. Other Pages
- Payments, Audit Logs, and Admins pages are placeholders
- Navigation structure is in place

## Project Structure Overview

```
payo-admin/
├── src/
│   ├── api/           # API client & endpoints
│   ├── features/      # Feature modules (auth, dashboard, users, etc.)
│   ├── layouts/       # Dashboard layout
│   ├── routes/        # TanStack Router routes
│   ├── store/         # Zustand auth store
│   ├── theme/         # MUI theme
│   ├── types/         # TypeScript types
│   └── utils/         # Utilities
```

## Key Technologies

- **React 19** + **TypeScript**
- **Vite** - Build tool
- **Material-UI** - UI components
- **TanStack Router** - Routing
- **TanStack Query** - Server state
- **Zustand** - Client state
- **Axios** - HTTP client

## Available Scripts

```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Features Implemented

✅ Authentication with JWT tokens
✅ Dashboard with metrics and activity
✅ User management (list, view, block/unblock)
✅ Merchant management (list, view, KYC approval)
✅ Protected routes with auth guard
✅ Automatic token refresh
✅ Responsive design
✅ Professional UI with Material-UI

## API Endpoints Used

All requests go through the API Gateway at `http://localhost:3000`:

- **Auth**: `/api/v1/admin/login`
- **Dashboard**: `/api/v1/admin/dashboard/*`
- **Users**: `/api/v1/admin/users/*`
- **Merchants**: `/api/v1/admin/merchants/*`
- **Audit**: `/api/v1/admin/audit`

## Troubleshooting

### Cannot connect to backend
- Ensure all backend services are running: `pm2 list`
- Check if ports are accessible
- Verify `.env.development` has correct URLs

### Login fails
- Check if auth-service is running on port 3001
- Check if admin-service is running on port 3010
- Verify default admin exists in MongoDB

### Build errors
- Delete `node_modules` and run `npm install`
- Check Node.js version (18+)
- Clear Vite cache: `rm -rf node_modules/.vite`

## Environment Variables

The `.env.development` file is already configured:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_AUTH_SERVICE_URL=http://localhost:3001
VITE_ADMIN_SERVICE_URL=http://localhost:3010
VITE_APP_NAME=Payo Admin Dashboard
VITE_APP_VERSION=1.0.0
```

## Next Steps

1. Test all implemented features
2. Verify API integration with backend
3. Customize theme if needed (see `src/theme/theme.ts`)
4. Implement remaining features:
   - Payment monitoring
   - Audit logs
   - Admin management
5. Add tests
6. Deploy to production

## Production Deployment

```bash
# Build for production
npm run build

# Output will be in dist/ folder
# Deploy to hosting service (Vercel, Netlify, etc.)
```

## Support

- See `PROJECT_SUMMARY.md` for detailed architecture
- See `README.md` for full documentation
- Check MUI docs: https://mui.com/
- Check TanStack docs: https://tanstack.com/

---

**The application is ready to use!** 🚀

Open http://localhost:5173 and login with the provided credentials.
