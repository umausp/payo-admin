# Payo Admin Dashboard

Production-grade admin dashboard for the Payo crypto payment processing platform. Built with React, TypeScript, Material-UI, and TanStack Router/Query.

## Features

- **Authentication**: Secure admin login with JWT tokens
- **Dashboard**: Real-time system metrics and activity monitoring
- **User Management**: View, block/unblock users, transaction history
- **Merchant Management**: KYC verification, merchant activation/deactivation
- **Payment Monitoring**: Track all payment transactions
- **Audit Logs**: Complete activity tracking for compliance
- **Role-Based Access**: Support for admin and super_admin roles

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Material-UI (MUI)** - Component library
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Axios** - HTTP client
- **React Hook Form + Zod** - Form validation
- **Recharts** - Data visualization

## Prerequisites

- Node.js 18+ and npm
- Payo backend services running (see payo-backend README)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` and login with:
- **Email**: admin@payo.com
- **Password**: Admin@123456

## Environment Variables

Create `.env.development`:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_AUTH_SERVICE_URL=http://localhost:3001
VITE_ADMIN_SERVICE_URL=http://localhost:3010
VITE_APP_NAME=Payo Admin Dashboard
VITE_APP_VERSION=1.0.0
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── api/              # API client and endpoints
├── features/         # Feature modules (auth, dashboard, users, merchants)
├── layouts/          # Layout components
├── routes/           # File-based routing
├── store/            # Zustand stores
├── theme/            # MUI theme
├── types/            # TypeScript types
└── utils/            # Utilities
```

## Default Credentials

- Email: admin@payo.com
- Password: Admin@123456

⚠️ Change in production!
