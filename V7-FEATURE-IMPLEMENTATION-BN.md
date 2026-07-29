# V7 Additive Feature Implementation Summary

এই package-এ original V7-এর existing design, product catalog, admin controls, authentication, Top Sale, Cloudinary product upload এবং protected developer credit রেখে শুধু approved featureগুলো যোগ করা হয়েছে।

## Implemented

1. Existing customer Email OTP flow retained.
2. Order submit হলে customer confirmation email.
3. নতুন order হলে admin/page email-এ full order email.
4. Customer ও admin email-এ PDF invoice attachment.
5. Order success page-এ secure invoice view, PDF download এবং print.
6. Logged-in customer account ও admin order page থেকে PDF invoice download.
7. Cash on Delivery.
8. bKash, Nagad ও Rocket logo-based manual payment selection.
9. Payment number `+8801816339639` এবং Copy Number button.
10. Sender number এবং unique Transaction ID validation.
11. Optional payment screenshot upload to Cloudinary.
12. Manual payment order-এর initial payment status `PENDING`.
13. Inside Dhaka delivery charge `৳60`.
14. Outside Dhaka delivery charge `৳120`.
15. Footer ও floating normal WhatsApp button-এ pre-filled support message.
16. Admin order details-এ provider, sender number, transaction ID, screenshot, delivery zone এবং delivery charge.

## Intentionally not implemented now

- SMS OTP
- Automatic bKash/Nagad/Rocket gateway
- Automatic WhatsApp order notification
- Automatic WhatsApp welcome reply
- WhatsApp Business API

Normal WhatsApp link customer-এর chat input-এ message pre-fill করবে; customer-কেই Send চাপতে হবে।

## Required one-time commands

```bash
npm install
npx prisma generate
npx prisma db push
npm run typecheck
npm run build
npm run dev
```

Existing database data delete করার প্রয়োজন নেই। `prisma db push` additive order fields এবং enums যোগ করবে।

## Environment variables

```env
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_ENABLE_STRIPE="false"
NEXT_PUBLIC_ENABLE_MOBILE_BANKING="true"
NEXT_PUBLIC_MOBILE_BANKING_NUMBER="+8801816339639"
ADMIN_ORDER_EMAIL="butterflythe710@gmail.com"
RESEND_API_KEY="re_your_key"
EMAIL_FROM="The Butterfly <orders@your-verified-domain.com>"
```

Cloudinary variables payment screenshot upload-এর জন্যও প্রয়োজন:

```env
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

## Test checklist

- New customer registration ও Email OTP
- COD order
- bKash order, Copy Number, sender number, transaction ID
- Nagad order
- Rocket order
- Duplicate Transaction ID rejection
- Optional screenshot upload
- Inside Dhaka total = subtotal + `৳60`
- Outside Dhaka total = subtotal + `৳120`
- Customer confirmation email ও PDF attachment
- Admin order email ও PDF attachment
- Success page PDF download এবং print
- Admin payment verification ও order status update
- WhatsApp button pre-filled message
