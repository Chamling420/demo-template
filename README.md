# La Bella - Beauty Salon

A modern, full-featured beauty salon web application. La Bella lets customers browse services, book appointments, shop products, and pay online — while admins manage everything from a powerful dashboard.

---

## What's Inside

**For Customers**
- Browse services and book appointments with a calendar date picker
- Shop beauty products with search, filters, and sorting
- Add to cart and checkout with cash on delivery or online payment
- Leave reviews with star ratings
- Browse the gallery
- Message the salon directly through the built-in chat
- Dark/light mode toggle

**For Admins**
- Add, edit, and remove services and products
- Manage appointments (confirm/cancel)
- View and reply to customer messages
- Process orders — view payment slips, confirm or cancel
- Edit all home page content (hero text, stats, footer, social links, navbar branding)
- Manage gallery images

**For Super Admins**
- Everything admins can do, plus:
- Manage users (change roles, delete accounts)
- Set up payment methods (Bank Transfer, eSewa, Khalti, IME Pay) with QR codes
- Full control over all site settings

---

## Tech Stack

- **Next.js 16** with App Router and TypeScript
- **Tailwind CSS 4** for styling
- **shadcn/ui** component library
- **Zustand** for state management (persisted to localStorage)
- **Framer Motion** for animations
- **Lucide React** for icons

---

## Getting Started

### Prerequisites
- Node.js 18+ or Bun

### Setup

```bash
git clone https://github.com/Chamling420/demo-template.git
cd demo-template
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How It Works

### Content Management
All text on the home page — hero section, stats, footer, social links, navbar logo and brand name — can be edited from the Settings tab in the admin panel. Changes save automatically.

### Payments
Users can pay with cash on delivery or choose from active online payment methods. Online payments require a verification step where users enter their name, transaction number, and upload a payment slip. Admins can view these slips and verify payments.

### Image Uploads
The app supports uploading images from your device or pasting a URL. This works for product images, gallery photos, payment method QR codes, and payment slips.

### Data Storage
All data is stored in your browser's localStorage. No external database is needed. This keeps things simple and instant — just open the app and everything is there.

---

## Project Structure

```
src/
├── app/
│   ├── api/upload/          # Image upload endpoint
│   ├── globals.css          # Theme and global styles
│   ├── layout.tsx           # Root layout with theme provider
│   └── page.tsx             # Main page (single-page app)
├── components/
│   ├── pages/
│   │   ├── HomePage.tsx     # Landing page
│   │   ├── ServicesPage.tsx # Services + booking
│   │   ├── ProductsPage.tsx # Product catalog
│   │   ├── CartPage.tsx     # Cart and checkout
│   │   ├── AppointmentsPage.tsx
│   │   ├── GalleryPage.tsx
│   │   ├── ReviewsPage.tsx
│   │   ├── AdminPanel.tsx   # Admin dashboard
│   │   ├── SuperAdminPanel.tsx
│   │   ├── ProfilePage.tsx
│   │   └── AuthPages.tsx    # Login and register
│   ├── ui/                  # Reusable UI components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── MessageUs.tsx        # Floating chat widget
│   └── ThemeProvider.tsx
├── lib/
│   ├── store.ts             # Zustand store (all state)
│   └── utils.ts
└── hooks/
    ├── use-toast.ts
    └── use-mobile.ts
```

---

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload an image (multipart/form-data, max 10MB) |

Supported formats: JPEG, PNG, GIF, WebP, SVG, HEIC, BMP, AVIF. Files are stored in `public/uploads/`.

---

## Notes

- Currency is displayed in Nepalese Rupees (NPR)
- The app is fully responsive — works on desktop and mobile
- Admin panels have separate table layouts for desktop and card layouts for mobile
- Payment methods support Bank Transfer and popular Nepali wallets (eSewa, Khalti, IME Pay)
