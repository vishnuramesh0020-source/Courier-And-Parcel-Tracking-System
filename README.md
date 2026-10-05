# Global Connect Couriers - Courier & Parcel Tracking System

A modern, high-tech logistics and parcel tracking web application built with React 19, Vite, Tailwind CSS, React Hook Form, and React Toastify.

## Module 1: Authentication & Access Portal
- **High-Tech Aesthetic**: Dark navy digital background featuring a glowing global logistics network and 3D cyan orbital Earth globe icon.
- **Card-Free Floating Design**: Minimalist, sleek UI with border-glow inputs and solid action buttons floating directly over the canvas.
- **User Authentication**:
  - Secure Login with show/hide password toggle and quick-demo shortcuts.
  - User Registration with role selection (`Courier Client`, `Courier Agent`, `Fleet Manager`).
  - Forgot Password & 2-step verification code reset flow.
  - Persistent sessions and user directory saved in `localStorage`.
  - Protected Dashboard route (`/dashboard`) guarded by `ProtectedRoute`.

## Demo Accounts
Quick-access buttons are available on the login page:
- **Administrator**: `admin@globalconnect.com` / `Password123!`
- **Courier Agent**: `agent@globalconnect.com` / `Password123!`
- **Client**: `client@globalconnect.com` / `Password123!`

## Getting Started

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Linting
```bash
npm run lint
```
