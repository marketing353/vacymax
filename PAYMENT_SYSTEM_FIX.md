# Payment System Fix - VacyMax

## Issues Identified and Fixed

### 1. **Vercel Configuration Issue** ✅ FIXED
**Problem**: The `vercel.json` had a catch-all rewrite `"source": "/(.*)"` that was redirecting ALL requests (including API calls) to `/index.html`, preventing serverless functions from being reached.

**Solution**: Updated the rewrite pattern to exclude API routes:
```json
"source": "/((?!api).*)"
```

This uses a negative lookahead to exclude any paths starting with `/api`.

---

### 2. **Missing Dependencies** ✅ FIXED
**Problem**: The `package.json` was missing critical dependencies:
- `stripe` - Required for Stripe payment processing
- `@supabase/supabase-js` - Required for database logging

**Solution**: Added both dependencies to `package.json`:
```json
"dependencies": {
  "@supabase/supabase-js": "^2.39.0",
  "stripe": "^14.10.0",
  ...
}
```

---

### 3. **Module System Mismatch** ✅ FIXED
**Problem**: API files were using ES6 modules (`import`/`export`) but Vercel serverless functions require CommonJS (`require`/`module.exports`).

**Solution**: Converted all API files to CommonJS:
- `api/create-checkout-session.js`
- `api/stripe-webhook.js`

Changed from:
```javascript
import Stripe from 'stripe';
export default async function handler(req, res) { ... }
```

To:
```javascript
const Stripe = require('stripe');
module.exports = async function handler(req, res) { ... }
```

---

## Required Actions

### Step 1: Install Dependencies
Run this command to install the new dependencies:
```bash
npm install
```

### Step 2: Configure Environment Variables
Make sure your `.env` file has all required variables:

```env
# Stripe Keys (Get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase (Get from https://app.supabase.com/project/_/settings/api)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Vercel URL (auto-set in production, use localhost for dev)
VERCEL_URL=localhost:5173
```

### Step 3: Test Locally
1. Start the dev server:
   ```bash
   npm run dev
   ```

2. The payment flow should now work, but note that API routes won't work in Vite dev mode. You have two options:

   **Option A: Use Vercel CLI (Recommended)**
   ```bash
   npm install -g vercel
   vercel dev
   ```
   This will run your app with serverless functions working locally.

   **Option B: Use the fallback payment link**
   The code already has a fallback to a Stripe Payment Link when the API isn't available.

### Step 4: Deploy to Vercel
Once you've tested locally:
```bash
vercel --prod
```

Make sure to set all environment variables in the Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all the variables from your `.env` file

---

## How the Payment Flow Works Now

1. **User clicks "Unlock Full Plan"** → Opens PaymentModal
2. **User enters email and clicks checkout** → Calls `/api/create-checkout-session`
3. **API creates Stripe session** → Returns checkout URL
4. **User redirected to Stripe** → Completes payment
5. **Stripe redirects back** → URL includes `?payment=success&session_id=...`
6. **App detects success** → Unlocks the plan
7. **Stripe sends webhook** → `/api/stripe-webhook` logs to Supabase

---

## Testing the Payment System

### Test in Development
1. Use Stripe test mode keys (starting with `sk_test_` and `pk_test_`)
2. Use test card: `4242 4242 4242 4242`
3. Any future expiry date and any CVC

### Test Webhooks Locally
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Forward webhooks to local:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe-webhook
   ```
3. Copy the webhook signing secret to your `.env` as `STRIPE_WEBHOOK_SECRET`

---

## Common Issues & Solutions

### Issue: "Failed to create checkout session"
- **Check**: Are your Stripe keys set in `.env`?
- **Check**: Did you run `npm install`?
- **Check**: Are you using `vercel dev` instead of `npm run dev`?

### Issue: Payment succeeds but plan doesn't unlock
- **Check**: Is the success URL redirect working? (Check browser console)
- **Check**: Is the webhook being received? (Check Stripe dashboard > Webhooks)
- **Check**: Are Supabase credentials correct?

### Issue: API routes return 404
- **Check**: Did you deploy the updated `vercel.json`?
- **Check**: Are you testing with `vercel dev` or on deployed Vercel?
- **Check**: Clear your browser cache and redeploy

---

## Production Checklist

Before going live:
- [ ] Switch to live Stripe keys (starting with `sk_live_` and `pk_live_`)
- [ ] Set up webhook endpoint in Stripe dashboard pointing to `https://yourdomain.com/api/stripe-webhook`
- [ ] Add webhook signing secret to Vercel environment variables
- [ ] Test a real payment with a small amount
- [ ] Verify webhook is logging to Supabase
- [ ] Set up Stripe email receipts
- [ ] Configure proper error monitoring

---

## Files Modified
1. ✅ `vercel.json` - Fixed API routing
2. ✅ `package.json` - Added dependencies
3. ✅ `api/create-checkout-session.js` - Converted to CommonJS
4. ✅ `api/stripe-webhook.js` - Converted to CommonJS

---

## Next Steps
1. Run `npm install` to install new dependencies
2. Test with `vercel dev`
3. Deploy to Vercel
4. Configure environment variables in Vercel dashboard
5. Test the complete payment flow
