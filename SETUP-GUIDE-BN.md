# The Butterfly — Full-Stack Setup Guide (বাংলা)

এই guide অনুসরণ করলে local development, user login, admin login, products, Top Sale, order management, Cloudinary, Stripe এবং Vercel deployment ধাপে ধাপে complete করা যাবে।

## 1. এই version-এ কী ঠিক করা হয়েছে

- Top Sale section database-এর `isBestSeller` value থেকে product দেখায়।
- নতুন product যোগ করার সময় **Mark as Top Sale** checkbox আছে।
- পুরোনো product edit করেও **Top Sale** এবং **New Arrival** on/off করা যায়।
- Admin order list-এ products, size, colour, quantity, address, notes এবং payment reference দেখা যায়।
- Admin delivery status এবং payment status update করতে পারে।
- Order Cancelled/Returned/Refunded করলে deducted stock নিরাপদভাবে restore হয়।
- Uploaded project-এর Prisma schema SQLite ছিল কিন্তু environment PostgreSQL ছিল; schema এখন Neon/Vercel-compatible PostgreSQL করা হয়েছে।

## 2. গুরুত্বপূর্ণ নিরাপত্তা নিয়ম

- `.env` এবং `.env.local` GitHub-এ upload করবে না।
- Database URL, JWT secret, admin password, Stripe secret এবং Cloudinary secret কাউকে পাঠাবে না।
- Client handover-এর আগে admin password পরিবর্তন করবে।

## 3. Project open করা

1. ZIP extract করো।
2. VS Code খুলে **File → Open Folder** থেকে `the-butterfly` folder open করো।
3. VS Code terminal খোলো: **Terminal → New Terminal**।

## 4. Environment file তৈরি

Project root-এ `.env.example` copy করে `.env` তৈরি করো। Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

তারপর `.env`-এ values বসাও:

```env
DATABASE_URL="YOUR_NEON_POSTGRESQL_CONNECTION_STRING"
JWT_SECRET="A_LONG_RANDOM_SECRET"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_ENABLE_STRIPE="false"
NEXT_PUBLIC_ENABLE_MOBILE_BANKING="true"
NEXT_PUBLIC_MOBILE_BANKING_NUMBER="+8801816339639"
ADMIN_EMAIL="your-admin-email@example.com"
ADMIN_PASSWORD="A-STRONG-ADMIN-PASSWORD"
ADMIN_ORDER_EMAIL="butterflythe710@gmail.com"

CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

RESEND_API_KEY="re_..."
EMAIL_FROM="The Butterfly <verify@yourdomain.com>"

STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

Cloudinary product ও optional payment screenshot upload-এর জন্য configure করো। Manual bKash/Nagad/Rocket payment এই V7 update-এ enabled; payment number `+8801816339639`। Stripe ব্যবহার না করলে `NEXT_PUBLIC_ENABLE_STRIPE="false"` রাখো।

## 5. Dependencies install

```bash
npm install
```

## 6. Prisma client ও database tables

```bash
npx prisma generate
npx prisma db push
```

`db push` database-এ User, Product, Category, Order, Wishlist ইত্যাদি table তৈরি/update করবে।

## 7. Admin account ও demo data তৈরি

প্রথমে `.env`-এ `ADMIN_EMAIL` ও `ADMIN_PASSWORD` ঠিক আছে কিনা নিশ্চিত করো। এরপর:

```bash
npm run db:seed
```

এই command:

- owner/admin account তৈরি করবে
- Women, Men ও Children categories তৈরি করবে
- demo products তৈরি করবে
- কিছু demo product Top Sale হিসেবে mark করবে

Admin email/password পরে পরিবর্তন করলে `.env` update করে আবার `npm run db:seed` চালাতে পারো। Existing admin account update হবে।

## 8. Local website run

```bash
npm run dev
```

Browser URLs:

- Website: `http://localhost:3000`
- User registration: `http://localhost:3000/auth/register`
- User login: `http://localhost:3000/auth/login`
- Customer dashboard: `http://localhost:3000/account`
- Wishlist: `http://localhost:3000/wishlist`
- Admin dashboard: `http://localhost:3000/admin`
- Admin products: `http://localhost:3000/admin/products`
- Admin orders: `http://localhost:3000/admin/orders`

## 9. User account কীভাবে কাজ করে

1. Customer **Create Account** page থেকে name, phone, email ও password দেয়।
2. Password database-এ plain text হিসেবে নয়—bcrypt hash হিসেবে save হয়।
3. Registration-এর পর email-এ ৬-digit OTP যায় এবং customer verification page-এ code দেয়।
4. Verification successful হলে secure HTTP-only session cookie তৈরি হয়।
5. Customer `/account` page-এ নিজের orders দেখতে পারে।
6. Wishlist database-এ user account-এর সঙ্গে save হয়।

বর্তমান version-এ signup এবং unverified account-এর first login-এ ৬-digit email OTP verification আছে। Forgot-password email এবং Google login এখনো আলাদা feature হিসেবে যোগ করা হয়নি।

## 10. Admin login কীভাবে করবে

1. `http://localhost:3000/auth/login` open করো।
2. `.env`-এর `ADMIN_EMAIL` দাও।
3. `.env`-এর `ADMIN_PASSWORD` দাও।
4. Login successful হলে `/admin` dashboard open হবে।

Normal customer `/admin` access করতে পারবে না। Middleware role check করে block করবে।

## 11. Product add করার নিয়ম

1. Admin login করো।
2. `/admin/products` open করো।
3. প্রয়োজন হলে আগে category তৈরি করো।
4. Product form-এ:
   - Name
   - Slug
   - Women/Men/Children segment
   - Category
   - Item Type (Dress, Accessory, Footwear অথবা custom type)
   - Regular price
   - Sale price
   - SKU
   - Stock
   - Sizes
   - Colours
   - Image
   - Description
   পূরণ করো।
5. New Arrivals-এ দেখাতে **Mark as New Arrival** tick করো।
6. Top Sale-এ দেখাতে **Mark as Top Sale** tick করো।
7. **Create Product** চাপো।

Slug example: `pink-party-dress`

SKU example: `TB-W-105`

প্রতিটি product-এর SKU unique হতে হবে।

## 12. Existing product Top Sale করা

1. `/admin/products` page-এর product list থেকে **Edit** চাপো।
2. Edit popup-এ:
   - Published
   - New Arrival
   - Top Sale
   checkbox পাওয়া যাবে।
3. **Top Sale** tick করো।
4. **Save Changes** চাপো।
5. Homepage refresh করলে Top Sale section-এ product দেখাবে।

Homepage সর্বোচ্চ 4টি marked Top Sale product দেখায়।

## 13. Customer order flow

1. Customer product open করে size/colour নির্বাচন করে cart-এ যোগ করে।
2. Cart থেকে Checkout page open করে।
3. Name, phone, email ও delivery address দেয়।
4. Payment method নির্বাচন করে।
5. **Place Order** চাপলে order database-এ save হয়।
6. Order number তৈরি হয়, যেমন `TB-12345678-45`।
7. Order admin dashboard-এ সঙ্গে সঙ্গে দেখা যায়।

Customer login করা থাকলে order customer account-এর সঙ্গে link হয় এবং `/account`-এ দেখা যায়। Guest checkout করলে order admin দেখবে, কিন্তু পরে customer account history-তে দেখাবে না। তাই order history দরকার হলে checkout-এর আগে login করা ভালো।

## 14. Admin কোথায় order দেখবে

Admin login করার পরে:

```text
http://localhost:3000/admin/orders
```

এখানে দেখা যাবে:

- Order number ও date
- Customer name, phone, email
- Registered customer নাকি guest
- Ordered products
- Size, colour ও quantity
- Full delivery address
- Customer notes
- Payment method
- Payment reference
- Total price
- Payment status
- Delivery status

## 15. Order status-এর অর্থ

- `PENDING`: নতুন order
- `CONFIRMED`: admin order গ্রহণ করেছে
- `PROCESSING`: order প্রস্তুত হচ্ছে
- `PACKED`: packing complete
- `SHIPPED`: courier-এ দেওয়া হয়েছে
- `OUT_FOR_DELIVERY`: customer-এর কাছে যাচ্ছে
- `DELIVERED`: delivery complete
- `CANCELLED`: order cancelled
- `RETURNED`: product returned
- `REFUNDED`: টাকা ফেরত দেওয়া হয়েছে

Admin dropdown থেকে status পরিবর্তন করতে পারবে। Cancelled/Returned/Refunded করলে stock restore হবে। ভুল করে active status-এ ফিরিয়ে নিলে available stock check করে আবার stock deduct হবে।

## 16. Payment status-এর অর্থ

- `UNPAID`: টাকা পাওয়া হয়নি
- `PENDING`: payment verification চলছে
- `PAID`: payment received
- `FAILED`: payment failed
- `REFUNDED`: payment refunded

COD order delivered হওয়ার পর admin payment status `PAID` করবে। Mobile Banking transaction verify করার পরে `PAID` করবে।

## 17. Payment method flow

### Cash on Delivery

- Order database-এ save হয়।
- Stock সঙ্গে সঙ্গে কমে।
- Payment status `UNPAID` থাকে।
- Admin order process করে এবং delivery-এর পরে `PAID` করে।

### Manual Mobile Banking

- Customer bKash, Nagad অথবা Rocket logo select করে।
- Payment number copy করে exact payable amount পাঠায়।
- Sender number ও unique Transaction ID বাধ্যতামূলক।
- Payment screenshot optional।
- Admin transaction verify করে payment status `PAID` করে।

### Stripe Card Payment

- Stripe keys configure থাকলে customer Stripe Checkout page-এ যায়।
- Successful verified payment-এর পর payment `PAID` ও order `CONFIRMED` হয়।
- Stock successful payment-এর পর কমে।

## 18. Cloudinary image upload

Cloudinary credentials `.env`-এ বসানোর পর admin product form-এর **Upload Image** button কাজ করবে। Credentials না থাকলে সরাসরি hosted image URL paste করা যায়।

## 19. Local testing checklist

এই order-এ test করো:

1. New customer register
2. Login/logout
3. Women/Men/Children pages
4. Search
5. Wishlist
6. Add to cart
7. Size/colour selection
8. COD checkout
9. Customer account order history
10. Admin login
11. Admin order details
12. Order status update
13. Payment status update
14. Product add/edit/archive/restore
15. New Arrival toggle
16. Top Sale toggle
17. Cancel order and stock restoration
18. Mobile responsiveness

## 20. GitHub upload

`.gitignore`-এ `.env`, `.env.local`, `node_modules`, `.next` আছে কিনা নিশ্চিত করো। তারপর:

```bash
git init
git add .
git commit -m "Complete The Butterfly full-stack ecommerce"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## 21. Vercel deployment overview

1. Project GitHub-এ push করো।
2. Vercel-এ repository import করো।
3. Vercel Project Settings → Environment Variables-এ `.env.example`-এর সব প্রয়োজনীয় values বসাও।
4. `NEXT_PUBLIC_SITE_URL` live URL-এ change করো।
5. Local terminal থেকে production Neon URL ব্যবহার করে:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

6. Vercel redeploy করো।
7. Live registration, COD order, admin order view ও image upload test করো।
8. Stripe ব্যবহার করলে live webhook endpoint configure করো।

## 22. Client handover-এর আগে

- Admin email/password client-এর নামে set করো
- Demo products remove/replace করো
- Real delivery charge set করো
- Return/refund policy লিখো
- Privacy Policy ও Terms যোগ করো
- Cloudinary client account-এ রাখো
- Neon database client ownership-এ রাখো
- Vercel project client team/account-এ transfer করো
- Stripe/payment account client-এর নামে ব্যবহার করো
- Database backup plan রাখো

