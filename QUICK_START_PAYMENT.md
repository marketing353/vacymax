# Quick Start: Testing Payment System

## ⚡ Quick Test (Recommended)

### Option 1: Test with Vercel CLI (Full functionality)
```bash
# Install Vercel CLI globally (one time only)
npm install -g vercel

# Run dev server with serverless functions
vercel dev
```

Then open http://localhost:3000 and test the payment flow.

---

### Option 2: Test with Regular Dev Server (Fallback mode)
```bash
npm run dev
```

The app will use the fallback Stripe Payment Link when API routes aren't available.

---

## 🔑 Environment Variables Needed

Create/update your `.env` file with:

```env
# Stripe Test Keys (from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY_HERE

# Supabase (from https://app.supabase.com/project/_/settings/api)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# For local development
VERCEL_URL=localhost:3000
```

---

## 🧪 Test Card Numbers

Use these test cards with Stripe:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Auth**: `4000 0025 0000 3155`

Any future expiry date (e.g., 12/34) and any 3-digit CVC.

---

## 🚀 Deploy to Production

```bash
# Deploy to Vercel
vercel --prod
```

**Don't forget to:**
1. Set environment variables in Vercel dashboard
2. Switch to live Stripe keys (sk_live_... and pk_live_...)
3. Configure webhook in Stripe dashboard pointing to your domain

---

## 🐛 Troubleshooting

**Payment button does nothing?**
- Check browser console for errors
- Verify environment variables are set
- Make sure you ran `npm install`

**API returns 404?**
- Use `vercel dev` instead of `npm run dev`
- Check that vercel.json was updated

**Payment succeeds but plan stays locked?**
- Check the URL for `?payment=success` parameter
- Check browser console for errors
- Verify Stripe redirect URLs are correct

---

## 📝 What Was Fixed

1. ✅ Fixed Vercel routing to allow API calls
2. ✅ Added Stripe and Supabase dependencies
3. ✅ Converted API files to CommonJS format
4. ✅ Installed all dependencies

See `PAYMENT_SYSTEM_FIX.md` for detailed technical information.
