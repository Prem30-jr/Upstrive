# Upstrive Deployment Guide - Render

This guide will help you deploy the Upstrive MERN application on Render.

---

## Prerequisites

1. **GitHub Account** with the project pushed
2. **Render Account** ([render.com](https://render.com))
3. **MongoDB Atlas** cluster (free tier)
4. **Gmail App Password** for emails
5. **Razorpay** account for payments
6. **Cloudinary** account for file uploads

---

## Step 1: Push to GitHub

```bash
cd upstrive-demo
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/upstrive.git
git push -u origin main
```

---

## Step 2: Create MongoDB Atlas Database

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free cluster (Shared tier)
3. Click **Connect** → **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your database user password

**Connection String Format:**
```
mongodb+srv://username:password@cluster.xxxxx.mongodb.net/upstrive
```

---

## Step 3: Generate API Key for Retool

1. Go to [randomkeygen.com](https://randomkeygen.com)
2. Copy any key from "CodeIgniter Encryption Keys" section
3. Save this - you'll need it for Retool authentication

---

## Step 4: Setup Gmail App Password

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → 2-Step Verification → Turn ON
3. Security → App passwords → Generate
4. Select app: "Mail", Select device: "Other"
5. Copy the 16-character password

---

## Step 5: Get Razorpay Keys

1. Go to [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Settings → API Keys
3. Generate Test/Live keys
4. Copy `Key ID` and `Key Secret`

---

## Step 6: Get Cloudinary Credentials

1. Go to [cloudinary.com/console](https://cloudinary.com/console)
2. Copy your:
   - Cloud Name
   - API Key
   - API Secret

---

## Step 7: Deploy Backend on Render

### Option A: Deploy with render.yaml (Recommended)

1. Go to [render.com](https://render.com)
2. Click **New** → **Blueprint**
3. Connect your GitHub repo
4. Render will auto-detect `render.yaml`
5. Click **Apply**

### Option B: Manual Deploy

1. Go to [render.com](https://render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name:** `upstrive-api`
   - **Region:** Singapore (or nearest)
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add Environment Variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | Your MongoDB Atlas URI |
| `ADMIN_API_KEY` | Your generated API key |
| `EMAIL_USER` | Your Gmail address |
| `EMAIL_PASS` | Your Gmail app password |
| `RAZORPAY_KEY_ID` | Your Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | Your Razorpay Key Secret |
| `CLOUDINARY_CLOUD_NAME` | Your Cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |

6. Click **Create Web Service**

**Wait for deployment to complete!**

---

## Step 8: Deploy Frontend on Render

1. Go to [render.com](https://render.com)
2. Click **New** → **Static Site**
3. Connect your GitHub repo
4. Configure:
   - **Name:** `upstrive-frontend`
   - **Region:** Singapore
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
5. Add Environment Variables:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://upstrive-api.onrender.com` |

6. Click **Create Static Site**

---

## Step 9: Configure Custom Domain (Optional)

### Backend:
1. In Render dashboard → Your backend service
2. Settings → Custom Domains
3. Add your domain (e.g., `api.upstrive.com`)
4. Update DNS records as shown

### Frontend:
1. In Render dashboard → Your frontend site
2. Settings → Custom Domains
3. Add your domain (e.g., `www.upstrive.com`)
4. Update DNS records

---

## Step 10: Update Retool

Now you can use your deployed backend URL in Retool:

**Backend URL:**
```
https://upstrive-api.onrender.com
```

**Headers:**
```
x-api-key: your-admin-api-key
Content-Type: application/json
```

---

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin` | List all applications |
| `GET` | `/api/admin/:id` | Get single application |
| `PATCH` | `/api/admin/:id/status` | Update status |
| `GET` | `/api/admin/stats/summary` | Dashboard stats |
| `POST` | `/api/email/send-email` | Send email |
| `POST` | `/api/payment/create` | Create payment |
| `POST` | `/api/payment/verify` | Verify payment |
| `POST` | `/api/certificate/generate` | Generate certificate |

---

## Troubleshooting

### Backend not starting?
- Check logs in Render dashboard
- Verify all environment variables are set
- Check MongoDB URI is correct

### Frontend API calls failing?
- Verify `VITE_API_URL` points to your backend
- Check CORS settings in backend

### Emails not sending?
- Verify Gmail app password is correct
- Make sure 2FA is enabled on Google account

### Payment verification failing?
- Verify Razorpay keys are correct
- Check signature generation matches

---

## Free Tier Limits

| Service | Limit |
|---------|-------|
| Render Web Service | 750 hours/month |
| Render Static Site | 100GB bandwidth/month |
| MongoDB Atlas | 512MB storage |
| Cloudinary | 25 credits |

---

## URLs Format

After deployment, you'll have:

- **Frontend:** `https://upstrive-frontend.onrender.com`
- **Backend API:** `https://upstrive-api.onrender.com`
- **Health Check:** `https://upstrive-api.onrender.com/api/health`

---

**Need help?** Check Render docs: https://render.com/docs
