# Global Connect Couriers - Courier & Parcel Tracking System

A modern, high-tech logistics and parcel tracking web application built with React 19, Vite, Tailwind CSS, React Hook Form, and React Toastify.

---

## Module 1: Authentication & Access Portal
- **High-Tech Aesthetic**: Dark navy digital background featuring a glowing global logistics network and 3D cyan orbital Earth globe icon.
- **Card-Free Floating Design**: Minimalist, sleek UI with border-glow inputs and solid action buttons floating directly over the background canvas.
- **Secure Login (`LoginForm.jsx`)**:
  - Show/hide password toggle.
  - Form validation with React Hook Form.
  - Quick-demo shortcuts for instant login.
  - "Remember Me" credential persistence.
- **User Registration (`RegisterForm.jsx`)**:
  - Full Name, Email, Phone, Role dropdown (`Courier Client`, `Courier Agent`, `Fleet Manager`), Password, and Confirm Password.
  - Form validation and password matching confirmation.
- **Forgot Password Flow (`ForgotPasswordForm.jsx`)**:
  - 2-step verification code flow: enter email -> receive code (`123456`) -> reset password.
- **Session & State Management (`AuthContext.jsx`, `storage.js`)**:
  - User directory and session tokens saved in `localStorage`.
  - Route protection (`ProtectedRoute.jsx`) safeguarding `/dashboard`.

---

## Module 2: Dashboard (Cyber Command Center)
A fully responsive, edge-to-edge Cyber Command Center dashboard covering all 9 required operational items:

1. **Total Shipments**: Live counter (`12,854`) with YoY indicator and glowing progress bar.
2. **In Transit Parcels**: Real-time cargo in motion (`1,842`) with active flight indicator.
3. **Delivered Parcels**: Successfully delivered consignments (`10,130`) with optimal rating.
4. **Pending Deliveries**: Parcels queued at dispatch hubs (`882`).
5. **Total Customers**: Registered shippers and enterprise clients (`3,420`) with growth metrics.
6. **Today's Shipments**: Daily intake and dispatch counter (`348`).
7. **Delivery Success Rate**: On-time SLA index (`99.2%`) with achievement gauge.
8. **Recent Activities (`RecentActivities.jsx`)**:
   - Structured Live Courier Dispatch table with columns: `TRACKING ID`, `COURIER LINE`, `ORIGIN`, `DESTINATION`, `STATUS`, and `ACTION`.
   - Category filtering tabs: `ALL`, `TRANSIT`, `DELIVERED`, `DELAYED`, and `CUSTOMERS`.
   - Real-time search bar filtering across ID, location, or recipient.
   - Interactive tracking code links that open the live GPS Checkpoint Tracker.
9. **Quick Action Cards (`QuickActionCards.jsx`)**:
   - **Track Parcel**: Opens interactive GPS waypoint lookup modal.
   - **Create Shipment**: Opens consignment booking modal (increments totals and logs live dispatch).
   - **View Reports**: Triggers audited freight manifest CSV export with toast confirmation.
   - **Hub Dispatch Scan**: Simulates sorting terminal barcode scans with instant feedback.
   - **Register Client**: Opens corporate client onboarding modal.

### Additional Cyber Command Features:
- **High-Definition Holographic World Map (`CyberWorldMap.jsx`)**:
  - Photorealistic glowing cyan continents and cybernetic circuitry (`src/assets/cyber-world-map.jpg`).
  - Animated quadratic flight arcs with real-time laser dash effects.
  - Calibrated radar blip nodes for JFK, LHR, FRA, DXB, HND, SIN, SYD, and GRU.
  - Corridor filter buttons: `All Corridors`, `Transatlantic`, `Trans-Eurasia`, `Asia-Pacific`, and `Pan-American`.
  - Hover telemetry status popovers and click-to-track navigation.
- **Full-Width Edge-to-Edge Layout**: No unused side margins, expanding comfortably across all screen widths.

---

## Demo Accounts
Quick-access buttons are available on the login page:
- **Administrator**: `admin@globalconnect.com` / `Password123!`
- **Courier Agent**: `agent@globalconnect.com` / `Password123!`
- **Client**: `client@globalconnect.com` / `Password123!`

---

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
