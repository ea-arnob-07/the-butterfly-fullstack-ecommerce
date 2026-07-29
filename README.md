# The Butterfly — Full-Stack Fashion E-commerce

A full-stack fashion e-commerce website for **The Butterfly — Your Dream Line**, with Women, Men, and Children collections, customer authentication, cart, database-backed wishlist, order checkout, protected administration, Top Sale/New Arrival controls, image uploads, stock management, and Stripe-hosted card payment support.

## Current verified functionality

- Customer registration, email OTP verification, login, logout, protected account dashboard
- Admin role-based login and protected admin routes
- Women, Men, and Children collections
- Product variants with size, colour, and stock
- New Arrival and Top Sale sections controlled from admin
- Admin create/edit/publish/archive/restore products
- Admin category and flexible item-type management
- Search and database wishlist
- COD, bKash/Nagad/Rocket logo selection, manual transaction verification, and optional Stripe checkout
- Customer order confirmation email, order history, PDF invoice download, and print
- Admin order email, full payment proof details, delivery-status update, and payment-status update
- Stock deduction on order/payment
- Stock restoration on cancellation/return/refund
- PostgreSQL/Neon-compatible Prisma schema
- Cloudinary server-side image upload
- Vercel deployment configuration

## Quick start

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Open:

- Store: `http://localhost:3000`
- User registration: `http://localhost:3000/auth/register`
- User login: `http://localhost:3000/auth/login`
- Customer account: `http://localhost:3000/account`
- Admin dashboard: `http://localhost:3000/admin`
- Admin products: `http://localhost:3000/admin/products`
- Admin orders: `http://localhost:3000/admin/orders`

Admin credentials come from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`. Run `npm run db:seed` after setting them.

For the complete Bengali walkthrough, read **SETUP-GUIDE-BN.md**.

## Environment variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/the_butterfly?sslmode=require"
JWT_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_ENABLE_STRIPE="false"
NEXT_PUBLIC_ENABLE_MOBILE_BANKING="true"
NEXT_PUBLIC_MOBILE_BANKING_NUMBER="+8801816339639"
ADMIN_EMAIL="owner@thebutterfly.com"
ADMIN_PASSWORD="ChangeMe123!"
ADMIN_ORDER_EMAIL="butterflythe710@gmail.com"

CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

RESEND_API_KEY="re_..."
EMAIL_FROM="The Butterfly <verify@yourdomain.com>"
```

Never commit `.env` or `.env.local`.

## Production notes

- Use a managed PostgreSQL database such as Neon for deployment.
- Run Prisma schema updates against the production database from a trusted terminal.
- Use client-owned Cloudinary, Stripe/payment, database, domain, and Vercel accounts.
- Add password reset, policy pages, stronger distributed rate limiting, automatic payment gateway, SMS OTP, and WhatsApp Business API before high-volume production use.


## Added checkout and notification features

- Inside Dhaka delivery: **৳60**
- Outside Dhaka delivery: **৳120**
- bKash, Nagad, and Rocket visual selection
- Payment number copy button for `+8801816339639`
- Required sender number and unique transaction ID
- Optional Cloudinary payment screenshot
- Customer and admin order emails through Resend
- PDF invoice attachment, secure download, and browser print
- Normal WhatsApp support link with a pre-filled customer message

## New admin capabilities in this version

- 15 Bangladesh-focused Women, Men, and Children categories with one starter product in each category.
- Full category and item-type create, rename, soft-remove, and restore controls.
- Multiple product images, cover-image selection, and storefront image gallery.
- Product edit/archive/restore controls, including sizes, colours, price, stock, category, and publishing status.
- A dedicated **Admin → Page Management** area for brand identity, logo, favicon, optimized 4K hero cover, page title, descriptions, phone, email, WhatsApp, Facebook, and Instagram.
- Protected footer credit: **Designed & Developed by Estiuk Arafat Arnob · +8801313602221** is intentionally not exposed through Page Management.
- Optimized 3840×2160 WebP hero image for faster loading while retaining 4K resolution.

See `UPDATE-INSTRUCTIONS-BN.md` for the exact database update and run commands.
