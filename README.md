# 📦 Cartiq – Modern E-Commerce Platform

A full-featured e-commerce web application built with **Next.js (App Router)**, **Clerk Authentication**, **Prisma**, **Redux Toolkit**, **Stripe**, and **AI-assisted product creation**.

🔗 **Live Demo:** https://cartiq-ecommerce-web.vercel.app/

---

## 🛍️ Overview

Cartiq is a modern and scalable e-commerce platform where users can browse products, add them to favorites or cart, place orders using **Cash on Delivery (COD)** or **Stripe payments**, manage their account, and explore different stores.

It also includes a complete **Admin Dashboard** and **Seller Dashboard**, allowing store owners to manage products and orders, while admins approve stores, manage coupons, and analyze platform activity.

---

# ✨ Features

## 👤 User Features

### 🔐 Authentication (Clerk)

- Login/Signup using **Google** or **Email**
- Only authenticated users can:
  - Add products to Favorites
  - Add items to Cart
  - Place Orders
  - Create their own Store

---

## 🏠 Public Pages

- **Home** – Hero banner, categories, latest products, newsletter
- **Shop** – Browse all products with filtering & sorting
- **About** – Info about Cartiq's vision & mission
- **Contact** – Contact details & message form
- **Pricing** – Subscription plans (Free, Plus)
- **Privacy Policy**

---

## 🔎 Product Browsing

- Search bar
- Filter by category
- Sort by:
  - Price: Low → High / High → Low
  - Name: A–Z / Z–A
  - Newest
- Product details include:
  - Description
  - Reviews
  - Store details
  - Stock availability

---

## ❤️ Favorites

- Add/remove favorite items
- Favorites stored per user account

---

## 🛒 Cart & Checkout

- View all cart items
- Increase/decrease quantity
- Remove items
- Payment summary with:
  - Subtotal + Shipping
  - Coupon support
- Payment methods:
  - **Cash on Delivery (COD)**
  - **Stripe Payment**
- Address selection or add new address
- **20% OFF** for first-time users
- Invoice (PDF) download after successful order
- Failure page for unsuccessful Stripe payment

---

## 📦 Orders

- View past orders under “My Orders”
- Track order statuses: _Processing, Shipped, Delivered_

---

# 👨‍💼 Admin Features

Admin Sidebar includes: **Dashboard, Stores, Approve Store, Coupons**

### 📊 Admin Dashboard

- Total Products
- Total Revenue
- Total Orders
- Total Stores
- Graphs for order trends and store performance

### 🏪 Store Management

- View approved stores
- Activate/Deactivate stores

### 📝 Approve Store

- View pending store requests
- Approve/Reject stores

### 🎟️ Coupon Management

- Create coupons (New Users / Members / All Users)
- List all coupons
- Delete coupons

---

# 🛍️ Seller Features

Once a store is approved by the Admin, the user becomes a Seller.

Seller Sidebar includes: **Dashboard, Add Product, Manage Product, Orders**

### 📊 Seller Dashboard

- Total Products
- Total Earnings
- Total Orders
- Total Ratings
- Latest reviews list

### ➕ Add Product

- Upload product image
- **AI Assist** auto-fills:
  - Product name
  - Product description
- Set category, pricing, and stock

### 🛠️ Manage Products

- Edit product details
- Toggle stock availability
- Deactivate products when needed

### 📦 Store Orders

- View customer orders
- Update order status (Processing → Shipped → Delivered)
- View order details

---

# 📚 Tech Stack

### **Frontend**

- Next.js 15+ (App Router, Turbopack)
- React 19
- Tailwind CSS 4
- Redux Toolkit
- Framer Motion
- Recharts (data visualization)

### **Backend / API**

- Next.js Route Handlers (`app/api/*`)
- Prisma ORM
- Neon PostgreSQL (serverless database)
- Inngest (background jobs & workflows)

### **Authentication**

- Clerk (Google login + Email login)

### **Payments**

- Stripe

### **AI Integration**

- OpenAI API (AI-assisted product details)

### **File & Media Handling**

- ImageKit (image uploads & optimization)

### **Utilities & Libraries**

- Axios (API requests)
- date-fns (date formatting)
- react-hot-toast (notifications)
- Lucide React (icons)
- jsPDF + AutoTable (invoice PDF generation)
- ws (websocket support for Neon driver)

### **Dev Tools**

- Prisma CLI
- ESLint
- TailwindCSS/PostCSS

---

# 📁 Project Structure

A simplified view of the structure:

```bash
cartiq/
├── app/                            # Frontend pages (Next.js App Router)
│   ├── (public)/                   # Public-facing pages
│   ├── admin/                      # Admin dashboard pages
│   ├── api/                        # Backend API routes
│   ├── store/                      # Seller dashboard pages
├── assets/                         # Static assets (images, banners, icons)
├── components/                     # Reusable UI components
├── configs/                        # Config files (OpenAI, ImageKit)
├── inngest/                        # Background jobs/workflows
├── lib/                            # Redux slices, utilities, prisma client
├── middleware.ts                   # Clerk auth middleware
├── middlewares/                    # Custom server middlewares (admin, seller)
├── prisma/                         # Prisma schema & migrations
├── public/                         # Public static files
├── package.json
```

---

# 🚀 Getting Started (Local Development)

## 1️⃣ Clone the repository

```bash
git clone https://github.com/AishwaryaS9/Cartiq-EcommerceWeb.git

cd Cartiq-EcommerceWeb-main
```

2️⃣ Install dependencies

```bash
npm install
```

3️⃣ Setup environment variables

Create a .env file:

```
NEXT_PUBLIC_CURRENCY_SYMBOL = your_currency_symbol

ADMIN_EMAIL=your_admin_email

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

CLERK_SECRET_KEY=your_clerk_secret_key

DATABASE_URL=your_database_url

DIRECT_URL=your_direct_url

INNGEST_EVENT_KEY=your_inngest_event_key

INNGEST_SIGNING_KEY=your_inngest_signing_key

IMAGEKIT_PUBLIC_KEY=your_imagekit_pubic_key

IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

STRIPE_SECRET_KEY=your_stripe_secret_key

STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

OPENAI_API_KEY=your_openai_api_key

OPENAI_BASE_URL=your_openai_base_url

OPENAI_MODEL=your_openai_model

NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
```

4️⃣ Push database schema

```bash
npx prisma migrate dev
```

5️⃣ Start development server

```bash
npm run dev
```

6️⃣ Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🎯 Conclusion

Cartiq is a fully featured, modern e-commerce platform designed with scalability, performance, and user experience in mind. From seamless product browsing and secure checkout to powerful admin and seller dashboards, the application provides a complete ecosystem for buyers, sellers, and administrators. With integrations like Clerk authentication, Stripe payments, Prisma ORM, ImageKit, and AI-assisted product creation, Cartiq demonstrates a robust and production-ready architecture suitable for real-world commerce scenarios.

Whether you're exploring the platform as a user or extending it as a developer, Cartiq offers a solid foundation for building advanced e-commerce solutions with modern web technologies.
