# 🚀 VERCEL DEPLOYMENT GUIDE

## Quick Start (One-Click Deploy)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Required

Set these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Type | Required | Example |
|----------|------|----------|---------|
| `STRIPE_SECRET_KEY` | Secret | ✅ Yes | `sk_live_...` |
| `STRIPE_PUBLIC_KEY` | Public | ✅ Yes | `pk_live_...` |
| `NODE_ENV` | System | ✅ Yes | `production` |
| `GEMINI_API_KEY` | Secret | ❌ No | (deprecated) |

**Important**: 
- Mark `STRIPE_SECRET_KEY` as **sensitive**
- Use **Live keys** for production, **Test keys** for preview deployments

---

## 🔧 Method 1: GitHub Integration (Recommended)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "feat: Production-ready deployment with optimizations"
git push -u origin claude/optimize-performance-018WsFD3ep8mcvQFwneF5otu
```

### Step 2: Connect to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository: `marketing353/vacymax`
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Add Environment Variables
In Vercel dashboard:
```
STRIPE_SECRET_KEY=sk_live_your_key_here
STRIPE_PUBLIC_KEY=pk_live_your_key_here
NODE_ENV=production
```

### Step 4: Deploy!
Click "Deploy" - Vercel will:
- Install dependencies
- Run `npm run build`
- Deploy to production URL

**Result**: 
- Production: `https://vacymax.vercel.app`
- Preview (PRs): `https://vacymax-git-{branch}.vercel.app`

---

## 🖥️ Method 2: Vercel CLI (Advanced)

### Installation
```bash
npm install -g vercel
```

### Login
```bash
vercel login
```

### Deploy to Production
```bash
# First time setup
vercel

# Production deployment
vercel --prod
```

### Set Environment Variables via CLI
```bash
vercel env add STRIPE_SECRET_KEY production
# Paste your key when prompted

vercel env add STRIPE_PUBLIC_KEY production  
# Paste your key when prompted

vercel env add NODE_ENV production
# Type: production
```

---

## 🎯 Deployment Verification

### 1. Check Build Output
Expected bundle sizes:
```
✓ dist/index.html                    ~4 KB
✓ assets/js/react-vendor-[hash]      ~12 KB (gzip: 4 KB)
✓ assets/js/motion-vendor-[hash]     ~115 KB (gzip: 38 KB)
✓ assets/js/index-[hash]             ~240 KB (gzip: 74 KB)
```

### 2. Test Deployed App
Visit your deployment URL and verify:
- ✅ Landing page loads
- ✅ Wizard navigation works
- ✅ Plan generation succeeds
- ✅ Payment modal opens (Stripe integration)
- ✅ Page refresh doesn't cause 404 (SPA routing)

### 3. Performance Check
Run Lighthouse audit:
```bash
# Install lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://your-app.vercel.app --view
```

**Target Scores**:
- Performance: 90+ ✅
- Accessibility: 95+ ✅
- Best Practices: 95+ ✅
- SEO: 90+ ✅

---

## 🔒 Security Checklist

### Verified Security Headers (via vercel.json)
```json
{
  "headers": [
    {
      "key": "X-Content-Type-Options",
      "value": "nosniff"
    },
    {
      "key": "X-Frame-Options",
      "value": "DENY"
    },
    {
      "key": "X-XSS-Protection",
      "value": "1; mode=block"
    },
    {
      "key": "Referrer-Policy",
      "value": "strict-origin-when-cross-origin"
    }
  ]
}
```

### Test Security Headers
```bash
curl -I https://your-app.vercel.app | grep -E "X-|Referrer"
```

---

## 📊 Post-Deployment Monitoring

### Vercel Analytics (Recommended)
1. Enable in Vercel Dashboard → Analytics
2. Tracks:
   - Real User Metrics (RUM)
   - Core Web Vitals
   - Geographic distribution

### Error Monitoring
Logs available at:
- Vercel Dashboard → Deployments → [Select deployment] → Runtime Logs

### Performance Monitoring
- Check "Functions" tab for serverless function performance
- Monitor `/api/checkout` response times

---

## 🐛 Troubleshooting

### Issue: 404 on Page Refresh
**Cause**: Missing SPA routing configuration
**Fix**: Ensure `vercel.json` exists with rewrites:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Issue: Environment Variables Not Working
**Cause**: Variables not set for production environment
**Fix**: In Vercel dashboard, ensure variables are set for:
- ☑️ Production
- ☑️ Preview
- ☑️ Development

### Issue: Build Fails
**Cause**: Missing dependencies or TypeScript errors
**Fix**: 
```bash
# Local test
npm clean-install
npm run build

# Check for errors
npx tsc --noEmit
```

### Issue: Stripe Payment Fails
**Cause**: Using test keys in production
**Fix**: Verify environment variables:
```bash
vercel env ls
# Ensure production uses sk_live_* and pk_live_*
```

---

## 🔄 Continuous Deployment

### Automatic Deploys
Once connected to GitHub:
- **Main branch push** → Production deployment
- **PR creation** → Preview deployment
- **Commit to PR** → Updated preview

### Branch Preview URLs
Every PR gets a unique URL:
```
https://vacymax-git-{branch-name}-{team}.vercel.app
```

### Rollback
In Vercel Dashboard:
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

---

## 📈 Performance Optimizations Applied

✅ **Code Splitting**: Vendor chunks separated
✅ **Cache Headers**: Assets cached for 1 year
✅ **Minification**: ESBuild minification
✅ **Tree Shaking**: Dead code eliminated
✅ **Gzip Compression**: Automatic via Vercel
✅ **CDN**: Global edge network
✅ **HTTP/2**: Enabled by default

---

## 💰 Cost Estimation

### Vercel Hobby Plan (Free)
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Serverless functions (100 GB-hours)
- ✅ Custom domains
- ✅ SSL certificates

**Typical Usage**:
- 1000 visitors/month: **FREE**
- 10,000 visitors/month: **FREE**
- 100,000 visitors/month: ~$20/month (Pro plan)

---

## 🎉 Success Criteria

Deployment is successful when:
1. ✅ Build completes without errors
2. ✅ App loads at production URL
3. ✅ All routes work (no 404s)
4. ✅ Stripe integration functional
5. ✅ Lighthouse score >90
6. ✅ No console errors
7. ✅ Mobile responsive

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Vite Docs**: https://vitejs.dev/guide/
- **Project Issues**: https://github.com/marketing353/vacymax/issues

---

*Deployment guide by Senior Lead Developer*
*Last updated: 2025*
*Status: ✅ Production Ready*
