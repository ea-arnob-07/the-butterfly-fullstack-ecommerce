# The Butterfly — Fullstack E-Commerce

![The Butterfly](public/images/butterfly-hero-4k.webp)

**The Butterfly** is a premium, full-stack e-commerce web application tailored for modern fashion retail. Built with Next.js 15, React 19, and Prisma, it offers a seamless, high-performance shopping experience with a fully integrated Admin dashboard, secure authentication, and robust order management.

---

## 🚀 Features

### For Customers:
- **Premium UI/UX:** A stunning, responsive design with elegant CSS gradients and smooth micro-animations.
- **Product Catalog:** Browse Men's, Women's, and Children's collections with category and item-type filtering.
- **Secure Authentication:** Email OTP verification for Registration and Login via Resend (with a local dev fallback).
- **Cart & Checkout:** Integrated checkout flow with Stripe session tracking and dynamic delivery zones (Inside/Outside Dhaka).
- **User Dashboard:** Customers can view order history, manage saved addresses, and update profiles.
- **Wishlist:** Save favorite products for later.

### For Administrators:
- **Centralized Dashboard:** A complete Admin panel for managing Categories, Item Types, and Products.
- **Order Management:** View, confirm, and update order statuses with full payment tracking (COD, Mobile Banking, Card).
- **Inventory Control:** Automatic stock deduction on purchase, and soft/hard delete options for products.
- **Sales Analytics:** Real-time revenue statistics, top-selling items, and recent order tracking.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Frontend:** [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
- **Backend/Database:** [Prisma ORM](https://www.prisma.io/), PostgreSQL (Neon Serverless)
- **Authentication:** Custom session-based auth with bcrypt and HTTP-only cookies
- **Email Delivery:** [Resend](https://resend.com/) (OTP verification and password resets)
- **Payments:** Stripe integration readiness
- **Language:** TypeScript

---

## 💻 Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/ea-arnob-07/the-butterfly-fullstack-ecommerce.git
cd the-butterfly-fullstack-ecommerce
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add the following keys:
```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication & Security
JWT_SECRET="your-super-secret-jwt-key"

# Resend API (For OTP Emails)
RESEND_API_KEY="re_your_api_key_here"
EMAIL_FROM="The Butterfly <orders@yourdomain.com>"
```

### 4. Initialize Database
Push the Prisma schema to your database and generate the Prisma Client.
```bash
npx prisma db push
npx prisma generate
```

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note on Local Auth Testing:** In development mode (`NODE_ENV !== 'production'`), if Resend is not configured or fails, the application will gracefully fallback to "Development OTP Mode", printing the OTP code directly in your server console and UI for easy local testing.

---

## 📁 Project Structure

- `/src/app`: Next.js App Router pages and API routes (`/api`).
- `/src/components`: Reusable React components (UI, product cards, admin forms).
- `/src/lib`: Core utility functions, auth logic, and Prisma singletons.
- `/prisma`: Database schema definitions.

---

## 🛡️ License

This project is licensed under the MIT License.
