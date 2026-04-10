# Upstrive Deployment Guide

Deploy the Upstrive internship platform with **Supabase** + **Render** + **Vercel**.

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Vercel       │     │   Render       │     │   Supabase     │
│   (Frontend)    │────▶│   (Backend)    │────▶│   (Database)   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Prerequisites

1. **GitHub Account** with the project pushed
2. **Supabase Account** ([supabase.com](https://supabase.com))
3. **Render Account** ([render.com](https://render.com))
4. **Vercel Account** ([vercel.com](https://vercel.com))

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

## Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **New Project**
3. Fill in:
   - **Name:** `upstrive`
   - **Database Password:** Generate a strong password
   - **Region:** Choose nearest to you
4. Click **Create new project**

---

## Step 3: Run Database Schema

1. In Supabase dashboard → **SQL Editor**
2. Copy the content from `backend/supabase/schema.sql`
3. Paste and click **Run**

This will create:
- `internships` table
- `applications` table
- `contacts` table
- `newsletter_subscribers` table

---

## Step 4: Setup Supabase Storage

1. In Supabase dashboard → **Storage**
2. Create two buckets:
   - **Name:** `resumes` (for resume uploads)
   - **Name:** `certificates` (for certificate PDFs)
3. Set both to **Public**

---

## Step 5: Get Supabase API Keys

1. In Supabase dashboard → **Settings** → **API**
2. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`

---

## Step 6: Generate Admin API Key

1. Go to [randomkeygen.com](https://randomkeygen.com)
2. Copy any key from "CodeIgniter Encryption Keys" section
3. Save this - you'll need it for admin authentication

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
   - **Region:** Singapore
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add Environment Variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `SUPABASE_URL` | Your Supabase Project URL |
| `SUPABASE_ANON_KEY` | Your Supabase Anon Key |
| `ADMIN_API_KEY` | Your generated API key |

6. Click **Create Web Service**

**Wait for deployment to complete!**

---

## Step 8: Deploy Frontend on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variable:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://upstrive-api.onrender.com` |

5. Click **Deploy**

---

## API Endpoints Reference

### Public Routes (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/internships` | List all active internships |
| `GET` | `/api/internships/:id` | Get single internship |
| `POST` | `/api/applications` | Submit application |
| `POST` | `/api/contact` | Submit contact message |
| `POST` | `/api/newsletter` | Subscribe to newsletter |
| `GET` | `/api/certificates/verify/:id` | Verify certificate |

### Admin Routes (Auth Required)

Add header: `x-api-key: your-admin-api-key`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/applications` | List all applications |
| `GET` | `/api/admin/applications/:id` | Get single application |
| `PATCH` | `/api/admin/applications/:id/status` | Update status |
| `DELETE` | `/api/admin/applications/:id` | Delete application |
| `GET` | `/api/admin/stats` | Dashboard stats |
| `POST` | `/api/admin/certificates/generate` | Generate certificate |
| `POST` | `/api/admin/emails/send` | Send email |

---

## Database Tables

### internships
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | VARCHAR | Internship title |
| domain | VARCHAR | Domain category |
| duration | TEXT[] | Available durations |
| stipend | VARCHAR | Stipend range |
| skills_required | TEXT[] | Required skills |
| is_active | BOOLEAN | Active status |

### applications
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| full_name | VARCHAR | Student name |
| email | VARCHAR | Student email |
| phone | VARCHAR | Phone number |
| program | VARCHAR | Selected program |
| duration | VARCHAR | Selected duration |
| college | VARCHAR | College name |
| graduation_year | INTEGER | Graduation year |
| motivation | TEXT | Motivation letter |
| status | VARCHAR | Application status |
| certificate_url | TEXT | Certificate link |
| applied_at | TIMESTAMP | Application date |

---

## Troubleshooting

### Backend not starting?
- Check logs in Render dashboard
- Verify all environment variables are set
- Check Supabase URL and keys are correct

### Frontend API calls failing?
- Verify `VITE_API_URL` points to your Render backend
- Check CORS settings in backend

### Storage upload failing?
- Verify storage buckets are set to Public
- Check RLS policies in Supabase

---

## URLs Format

After deployment:

- **Frontend:** `https://your-frontend.vercel.app`
- **Backend API:** `https://upstrive-api.onrender.com`
- **Health Check:** `https://upstrive-api.onrender.com/api/health`

---

## Environment Variables Summary

### Backend (Render)
```
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIs...
ADMIN_API_KEY = your-secret-key
```

### Frontend (Vercel)
```
VITE_API_URL = https://upstrive-api.onrender.com
```

---

**Need help?** Check Supabase docs: https://supabase.com/docs
