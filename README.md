<div align="center">
  <img src="https://the-butterfly.vercel.app/images/butterfly-logo-transparent.png" alt="The Butterfly Logo" width="200"/>

  # 🦋 The Butterfly — Your Dream Line
  **A Premium Full-Stack Fashion E-commerce Platform**

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
  [![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

  ### 🌐 **[Live Demo: the-butterfly.vercel.app](https://the-butterfly.vercel.app)**
</div>

---

## 🚀 Overview

**The Butterfly** is a modern, high-performance fashion e-commerce website designed to provide a premium shopping experience. It features fully functional **Women, Men, and Children** collections, seamless customer authentication, secure checkout, robust order tracking, and a powerful admin dashboard.

### ✨ Key Features

🛒 **For Customers:**
- **Secure Authentication:** Registration with email OTP verification, login, and protected account dashboard.
- **Smart Shopping:** Advanced product variants (Size, Color, Stock), Categories, New Arrivals, and Top Sales.
- **Wishlist & Cart:** Database-backed wishlist and responsive cart management.
- **Flexible Checkout:** Support for COD, bKash, Nagad, Rocket (with logo selection and manual transaction verification), and optional Stripe checkout.
- **Order Tracking:** Automated email confirmations, PDF invoice generation, and real-time order history.

⚙️ **For Administrators:**
- **Dynamic Dashboard:** Role-based protected admin routes.
- **Product Management:** Create, edit, publish, archive, and restore products, categories, and flexible item types.
- **Order Fulfillment:** Comprehensive order management, payment proof verification, delivery status updates, and payment status tracking.
- **Inventory Control:** Automatic stock deduction on orders and restoration upon cancellation/refunds.
- **Media & Pages:** Cloudinary-backed multiple image uploads and a dedicated Page Management area to customize branding, hero images, and contact info.

---

## 🛠️ Technology Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Neon DB)
- **ORM:** Prisma
- **Media Storage:** Cloudinary
- **Emails:** Resend
- **Payments:** Stripe (Optional)
- **Deployment:** Vercel

---

## 🏃‍♂️ Quick Start

Follow these steps to run the project locally on your machine.

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/ea-arnob-07/the-butterfly-fullstack-ecommerce.git
cd the-butterfly-fullstack-ecommerce
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Setup Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/the_butterfly?sslmode=require"
JWT_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ADMIN_EMAIL="butterflythe710@gmail.com"
ADMIN_PASSWORD="TamannA111"
# Add your Cloudinary, Resend, and Stripe keys as well
```

### 4️⃣ Database Setup
Push the schema to your database and seed it with starter data:
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 5️⃣ Run the Development Server
```bash
npm run dev
```

---

## 🗺️ Navigation Guide

Once the server is running, you can access the following routes:

- 🏠 **Storefront:** `http://localhost:3000`
- 🔐 **Login:** `http://localhost:3000/auth/login`
- 📝 **Register:** `http://localhost:3000/auth/register`
- 👤 **Customer Account:** `http://localhost:3000/account`
- 🛡️ **Admin Dashboard:** `http://localhost:3000/admin`
- 📦 **Admin Products:** `http://localhost:3000/admin/products`
- 🛒 **Admin Orders:** `http://localhost:3000/admin/orders`

*(Run `npm run db:seed` to automatically create the admin account based on your `.env` credentials.)*

---

## 💡 Production Notes

- **Database:** It is highly recommended to use a managed PostgreSQL provider like **Neon** or **Supabase**.
- **Security:** Ensure you use client-owned API keys for Cloudinary, Stripe, and Resend. Never commit your `.env` file to the repository.
- **Containerization:** A `Dockerfile` and `.dockerignore` are included if you prefer deploying via Docker to platforms like AWS, Render, or DigitalOcean.

---

<div align="center">
  <p><strong>Designed & Developed by <a href="https://github.com/ea-arnob-07">Estiuk Arafat Arnob</a></strong> · +8801313602221</p>
  <p>Made with ❤️ in Bangladesh</p>
</div>
