# 🛍️ Shopify Custom Reviews Backend

A production-ready **Node.js + Express + MongoDB** backend API for a custom Shopify product review and rating system. Deploy to **Vercel** for free hosting.

---

## 📁 Project Structure

```
shopify-reviews-backend/
├── server.js                  ← Main Express server (Vercel entry point)
├── vercel.json                ← Vercel deployment config
├── package.json
├── .env.example               ← Copy this to .env for local dev
├── .gitignore
├── models/
│   └── Review.js              ← MongoDB schema
├── routes/
│   └── reviews.js             ← All API endpoints
└── shopify-liquid/
    └── sections/
        └── custom-reviews.liquid  ← Paste this in your Shopify theme
```

---

## 🚀 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/reviews?productId=<id>` | Get all reviews for a product |
| `POST` | `/api/reviews` | Submit a new review |
| `DELETE` | `/api/reviews/:id` | Delete a review |
| `PATCH` | `/api/reviews/:id/approve` | Approve/hide a review |

### POST Body Example:
```json
{
  "productId": "123456789",
  "name": "Ahmed Ali",
  "rating": 5,
  "reviewText": "Great product! Highly recommend."
}
```

---

## ⚙️ STEP 1 — MongoDB Atlas Setup (Free)

1. Go to **https://cloud.mongodb.com** → Sign up / Log in
2. Create a new **Free Cluster** (M0)
3. **Database Access** → Add a user with username & password
4. **Network Access** → Add IP: `0.0.0.0/0` (Allows Vercel to connect)
5. Click **Connect** → **Connect your application** → Copy the connection string
6. It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`
7. Add your database name: `...mongodb.net/shopify_reviews?retryWrites=true&w=majority`

---

## ⚙️ STEP 2 — GitHub Repository

```bash
# In the shopify-reviews-backend folder:
git init
git add .
git commit -m "Initial commit - Shopify Reviews Backend"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/shopify-reviews-backend.git
git branch -M main
git push -u origin main
```

---

## ⚙️ STEP 3 — Vercel Deployment

1. Go to **https://vercel.com** → Sign up with GitHub
2. Click **"New Project"** → Import your `shopify-reviews-backend` repo
3. Vercel will auto-detect it as Node.js
4. **Before deploying**, add Environment Variables:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster0.xxx.mongodb.net/shopify_reviews?retryWrites=true&w=majority` |
| `SHOPIFY_STORE_DOMAIN` | `your-store.myshopify.com` |

5. Click **Deploy** ✅
6. Your API URL will be: `https://shopify-reviews-backend.vercel.app`

---

## ⚙️ STEP 4 — Add to Shopify Theme

1. **Shopify Admin** → Online Store → Themes → ⋯ → **Edit code**
2. Go to **Sections** folder → Click **Add a new section**
3. Name it: `custom-reviews` → Click **Done**
4. **Delete** all default code in the file
5. **Copy and paste** the entire content of `shopify-liquid/sections/custom-reviews.liquid`
6. Click **Save**

### Add Section to Product Page:
1. Go to **Customize** (Theme Editor)
2. Navigate to a **Product** page
3. Click **Add section** → Find **"Custom Reviews"**
4. In the section settings, paste your **Vercel backend URL**
5. Click **Save**

---

## 🖥️ Local Development

```bash
# Install dependencies
npm install

# Create .env file from example
copy .env.example .env
# Then edit .env with your MongoDB URI and store domain

# Run development server
npm run dev

# Server starts at: http://localhost:5000
```

### Test with curl:
```bash
# Get reviews
curl "http://localhost:5000/api/reviews?productId=123"

# Post a review
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"productId":"123","name":"Test User","rating":5,"reviewText":"Amazing product!"}'
```

---

## ✅ Features

- ⭐ **Star Ratings** (1-5 stars)
- 👤 **Guest Reviews** — No login required
- 🔍 **Per-product** reviews using `productId`
- 📊 **Average rating** calculated automatically
- 🛡️ **Input validation** and XSS protection
- 🌐 **CORS configured** for your Shopify domain
- 🗑️ **Delete & Approve** endpoints for admin management
- 🚀 **Vercel-ready** serverless deployment

---

## 🔐 Security Notes

- Never commit your `.env` file (it's in `.gitignore`)
- Always add your **Vercel URL** to the CORS allowed origins if needed
- For production, change `isApproved: true` to `false` in `models/Review.js` if you want to manually approve reviews before they show

---

## 📞 Support

Deployed URL format: `https://<your-project-name>.vercel.app`
Health check: `GET https://<your-project-name>.vercel.app/`
