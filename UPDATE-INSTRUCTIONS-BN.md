# The Butterfly — Final V7 Update Guide

এই final version-এ যোগ/পরিবর্তন করা হয়েছে:

- Facebook ও Facebook Page link নতুন official URL-এ update
- Women, Men ও Children-এর জন্য Bangladesh-focused ৫টি করে মোট ১৫টি active category
- প্রত্যেক category-তে ১টি করে demo product; মোট ১৫টি starter product
- Admin Dashboard-এই তিন segment-এর category list দেখা যাবে
- Category add, rename, archive এবং restore
- আলাদা **Item Type Manager**: Dress, Clothing, Accessory, Footwear, Bag, Jewellery, Traditional Wear অথবা যেকোনো custom type add/rename/remove করা যাবে
- Product add/edit করার সময় Category-এর পাশাপাশি Item Type নির্বাচন
- একটি product-এ multiple image upload, reorder, delete এবং cover image নির্বাচন
- Homepage-এর সব visible “Bestseller” wording পরিবর্তন করে **Top Sale**
- Top Sale-marked product না থাকলে discounted product automatically Top Sale section-এ দেখাবে
- Women/Men/Children collection card-এর Men image একটি male fashion image দিয়ে replace
- Homepage hero-এর নিচে full-width infinite fashion carousel
- Signup এবং unverified account-এর first login-এ ৬-digit email OTP verification
- OTP expiry ১০ মিনিট, resend cooldown ৬০ সেকেন্ড এবং সর্বোচ্চ ৫টি incorrect attempt
- Protected developer credit অপরিবর্তনযোগ্য: **Designed & Developed by Estiuk Arafat Arnob · +8801313602221**

## 1. পুরোনো project update করার আগে

পুরোনো project-এর `.env` file নিরাপদে রেখে দিন। Final ZIP-এ নিরাপত্তার জন্য real `.env` দেওয়া হয়নি।

## 2. নতুন project folder-এ `.env` তৈরি

PowerShell:

```powershell
Copy-Item .env.example .env
```

তারপর পুরোনো `.env` থেকে প্রয়োজনীয় values নতুন `.env`-এ বসান। Email OTP production-এ কাজ করাতে আরও যোগ করুন:

```env
RESEND_API_KEY="re_your_real_key"
EMAIL_FROM="The Butterfly <verify@your-verified-domain.com>"
```

Local development-এ `RESEND_API_KEY` না থাকলে OTP terminal-এ `[DEV OTP]` হিসেবে দেখাবে এবং verification page-এও development OTP প্রদর্শিত হবে। Production-এ real email পাঠাতে Resend key ও verified sender/domain আবশ্যক।

## 3. একবার চালানোর প্রয়োজনীয় commands

VS Code-এ updated project folder open করে **নতুন Terminal**-এ চালান:

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Command-গুলোর কাজ:

- `prisma db push`: Email OTP, Item Type এবং নতুন relation-এর database table/field তৈরি করবে
- `db:seed`: ১৫টি category, ১৫টি demo product, item types, Top Sale items, Facebook link এবং admin verification status update করবে

## 4. Browser-এ test

```text
Website: http://localhost:3000
Signup: http://localhost:3000/auth/register
Login: http://localhost:3000/auth/login
Admin: http://localhost:3000/admin
Products/Categories/Item Types: http://localhost:3000/admin/products
Page Management: http://localhost:3000/admin/page-management
```

Test order:

1. Homepage-এ infinite carousel, Men card image এবং Top Sale products দেখুন।
2. Admin Dashboard-এ Women, Men ও Children-এর ৫টি করে category দেখুন।
3. `/admin/products` থেকে category ও item type add/rename/archive/restore test করুন।
4. একটি product-এ একাধিক ছবি upload করে cover image select করুন।
5. নতুন customer account create করে email OTP verify করুন।
6. Facebook icon ও “Facebook Page” link click করে নতুন page খুলছে কিনা দেখুন।

## 5. GitHub ও Vercel update

Local test successful হলে:

```bash
git add .
git commit -m "Release final catalog, Top Sale and email OTP update"
git push origin main
```

Vercel Environment Variables-এ এগুলো নিশ্চিত করুন:

```text
DATABASE_URL
JWT_SECRET
ADMIN_EMAIL
ADMIN_PASSWORD
RESEND_API_KEY
EMAIL_FROM
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Vercel deploy-এর আগে/পরে একই Neon `DATABASE_URL` ব্যবহার করে একবার চালান:

```bash
npx prisma db push
npm run db:seed
```

Existing orders/customer data delete হবে না। Default পুরোনো category শুধু inactive হবে; admin-created custom category delete করা হবে না।

---

## V7 Additive Checkout, Email & Invoice Features

এই update-এ পুরোনো V7 design, catalog, admin, authentication এবং product features অপরিবর্তিত রেখে শুধু নিচের নতুন feature যোগ করা হয়েছে:

- Existing 6-digit Email OTP retained
- Customer order confirmation email
- Admin full order email
- PDF invoice attachment, download এবং print
- Cash on Delivery
- Manual bKash, Nagad এবং Rocket logo selection
- Payment number: `+8801816339639` এবং Copy Number button
- Sender mobile number, unique Transaction ID এবং optional payment screenshot
- Inside Dhaka delivery charge `৳60`
- Outside Dhaka delivery charge `৳120`
- Normal WhatsApp support button-এ pre-filled customer message

### Database update

পুরোনো Neon database data delete না করে নতুন fields add করতে updated project folder থেকে চালান:

```bash
npx prisma generate
npx prisma db push
```

### Required environment variables

```env
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_ENABLE_MOBILE_BANKING="true"
NEXT_PUBLIC_MOBILE_BANKING_NUMBER="+8801816339639"
ADMIN_ORDER_EMAIL="butterflythe710@gmail.com"
RESEND_API_KEY="re_your_real_key"
EMAIL_FROM="The Butterfly <orders@your-verified-domain.com>"
```

`RESEND_API_KEY` configure না থাকলে local development-এ order save হবে, কিন্তু real confirmation email পাঠানো হবে না। Production sender email-এর domain Resend-এ verify করতে হবে।

### Manual payment flow

1. Customer bKash, Nagad অথবা Rocket logo select করবে।
2. Number copy করে exact payable amount Send Money করবে।
3. Sender number এবং Transaction ID দেবে।
4. চাইলে payment screenshot upload করবে।
5. Order payment status `PENDING` থাকবে।
6. Admin transaction verify করে payment status `PAID` করবে।
7. একই Transaction ID দ্বিতীয় order-এ ব্যবহার করা যাবে না।

### Invoice flow

- Order success page-এ full invoice দেখা যাবে।
- Customer `Download Invoice PDF` এবং `Print Invoice` ব্যবহার করতে পারবে।
- Customer confirmation email ও admin order email-এ invoice PDF attachment থাকবে।
- Logged-in customer account এবং admin order list থেকেও invoice download করা যাবে।

### WhatsApp limitation

Normal WhatsApp ব্যবহার করা হয়েছে। Website button click করলে chat খুলবে এবং customer-এর input box-এ support message আগে থেকে লেখা থাকবে। Customer-কেই Send চাপতে হবে। Automatic WhatsApp notification বা automatic welcome reply এই version-এ নেই।
