# 🚀 Vercel Deployment Guide

## Quick Setup Checklist

### ✅ Files Already Configured:
1. ✓ `vercel.json` - Routing configuration
2. ✓ `vite.config.ts` - Build settings
3. ✓ Environment variables in `.env`

## 📋 Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin master
```

### 2. Deploy on Vercel

#### Option A: Using Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository: `Raza-husain/git-push-trail`
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

5. **Add Environment Variables** (CRITICAL):
   - Click **"Environment Variables"**
   - Add these two variables:
     ```
     VITE_SUPABASE_URL=https://oqfmtyjuxrjwqvtgrhvm.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZm10eWp1eHJqd3F2dGdyaHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MDczOTIsImV4cCI6MjA3ODA4MzM5Mn0.M6xEspzSn8TqjArD5bcSVkd0R5RKQQLILq9pf3fZhOc
     ```

6. Click **"Deploy"**

#### Option B: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables when prompted or use:
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

### 3. Verify Deployment
Once deployed, Vercel will give you a URL like:
- `https://your-project.vercel.app`

Visit the URL and test:
1. ✅ Page loads correctly
2. ✅ Can add a savings goal
3. ✅ Data persists (saved to Supabase)

## 🔧 Troubleshooting

### Issue: Blank page or "Cannot find module"
**Solution**: Make sure environment variables are set in Vercel dashboard

### Issue: 404 on page refresh
**Solution**: Already fixed with `vercel.json` rewrites configuration

### Issue: Assets not loading
**Solution**: Already fixed by removing `base: './'` from vite.config.ts

### Issue: Build fails
**Solution**: Check build logs in Vercel dashboard. Common fixes:
```bash
# Test build locally first
npm run build

# If successful, the dist folder should have your files
ls -la dist
```

### Issue: Environment variables not working
**Solution**: 
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Make sure variables start with `VITE_`
3. Redeploy after adding variables

## 🔐 Security Notes

- ✅ `.env` is in `.gitignore` (your keys won't be committed)
- ✅ Environment variables are secure in Vercel
- ✅ Supabase anon key is safe to expose (it's meant for client-side use)

## 📝 Custom Domain (Optional)

After deployment, you can add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

## 🎉 Success!

Your savings tracker should now be live on Vercel! 🚀

**Next time you make changes:**
```bash
git add .
git commit -m "Update feature"
git push origin master
```

Vercel will automatically redeploy! ✨
