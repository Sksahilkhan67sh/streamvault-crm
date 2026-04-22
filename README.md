<div align="center">

# 🎯 StreamVault CRM

### A production-ready Client Lead Management System built with the MERN stack

[![Stack](https://img.shields.io/badge/Stack-MERN-6ee7b7?style=for-the-badge)](https://github.com/Sksahilkhan67sh/streamvault-crm)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Node](https://img.shields.io/badge/Node-20+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)

Capture leads from a public contact form and manage them through a full admin dashboard with status tracking, notes, follow-ups, and activity logs.

[Live Demo](#-deployment) · [Report Bug](https://github.com/Sksahilkhan67sh/streamvault-crm/issues) · [Request Feature](https://github.com/Sksahilkhan67sh/streamvault-crm/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Docker Setup](#-docker-setup)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Business Workflow](#-business-workflow)
- [Demo Credentials](#-demo-credentials)
- [License](#-license)

---

## 🌟 Overview

StreamVault CRM is a full-stack web application designed to help businesses capture, track, and convert leads efficiently. It features a public-facing contact form that automatically creates leads, and a secure admin dashboard to manage the entire sales pipeline.

**Key Highlights:**
- 🔐 Secure JWT-based authentication
- 📊 Real-time dashboard with conversion analytics
- 🔍 Full-text search with advanced filters
- 📤 One-click CSV export
- 🐳 Docker-ready for easy deployment
- 📱 Fully responsive design

---

## ✨ Features

### 🏠 Admin Dashboard
| Feature | Description |
|---------|-------------|
| Stats Overview | Total, New, Contacted, Converted leads with live conversion rate |
| Recent Leads | Instant view of the latest incoming leads |
| Follow-up Panel | Upcoming follow-ups sorted by date |
| Source Analytics | Breakdown of leads by origin (Website, LinkedIn, Referral, etc.) |

### 👥 Lead Management
| Feature | Description |
|---------|-------------|
| Full CRUD | Create, Read, Update, Delete leads |
| Search | Search by name, email, or company using MongoDB full-text index |
| Filters | Filter by status and source |
| Sort | Sort by newest, oldest, name, or follow-up date |
| Pagination | 12 leads per page |
| CSV Export | Download all leads as a CSV file in one click |

### 📋 Lead Detail View
| Feature | Description |
|---------|-------------|
| Status Flow | Transition leads through `new → contacted → converted` |
| Notes | Add internal notes with timestamps |
| Activity Log | Full history of every change made to the lead |
| Follow-up | Schedule a follow-up date for any lead |

### 🔒 Security
| Feature | Description |
|---------|-------------|
| JWT Auth | Token-based authentication with 7-day expiry |
| bcrypt | Password hashing at 12 salt rounds |
| Helmet | Secure HTTP response headers |
| Rate Limiting | 100 requests per 15-minute window |
| CORS | Configured for allowed origins only |
| Validation | Input validation on both frontend and backend |

### 🌐 Public Contact Form
- No login required — simulates a real website lead capture widget
- Validated with react-hook-form (frontend) and express-validator (backend)
- Automatically creates a lead with `status: new`

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 18 |
| **Routing** | React Router | v6 |
| **Forms** | React Hook Form | 7 |
| **HTTP Client** | Axios | 1.6 |
| **Backend** | Node.js + Express | 20 / 4 |
| **Database** | MongoDB + Mongoose | 7 / 8 |
| **Authentication** | JWT + bcryptjs | — |
| **Security** | Helmet, express-rate-limit, CORS | — |
| **Validation** | express-validator | 7 |
| **DevOps** | Docker, Docker Compose, nginx | — |

---

## 📁 Project Structure

```
streamvault-crm/
│
├── 📂 backend/
│   ├── 📂 config/
│   │   └── db.js                    # MongoDB connection
│   ├── 📂 controllers/
│   │   ├── auth.controller.js       # Login, getMe, logout
│   │   └── lead.controller.js       # All lead CRUD operations
│   ├── 📂 middleware/
│   │   ├── auth.middleware.js       # JWT route guard
│   │   ├── error.middleware.js      # Global error handler
│   │   └── validate.middleware.js   # Input validation runner
│   ├── 📂 models/
│   │   ├── Admin.model.js           # Admin schema + bcrypt hooks
│   │   └── Lead.model.js            # Lead schema with notes & activity
│   ├── 📂 routes/
│   │   ├── auth.routes.js           # /api/auth endpoints
│   │   └── lead.routes.js           # /api/leads endpoints
│   ├── 📂 utils/
│   │   └── seed.js                  # Database seeder script
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── server.js                    # Express app entry point
│
├── 📂 frontend/
│   ├── 📂 public/
│   │   └── index.html
│   └── 📂 src/
│       ├── 📂 components/
│       │   ├── common/              # Spinner, Badge, EmptyState, ConfirmDialog
│       │   ├── dashboard/           # StatsCards, RecentLeads, UpcomingFollowUps
│       │   ├── layout/              # Layout, Sidebar, Topbar
│       │   └── leads/               # LeadsTable, LeadForm, LeadNotes,
│       │                            # ActivityLog, StatusToggles, Pagination
│       ├── 📂 context/
│       │   ├── AuthContext.jsx      # Auth state + token verification
│       │   └── LeadsContext.jsx     # Leads CRUD state management
│       ├── 📂 hooks/
│       │   ├── useDebounce.js       # Search input debounce
│       │   └── useLeadFilters.js    # Filter, sort, pagination state
│       ├── 📂 pages/
│       │   ├── LoginPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── LeadsPage.jsx
│       │   ├── LeadDetailPage.jsx
│       │   └── ContactPage.jsx      # Public contact form
│       ├── 📂 services/
│       │   └── api.js               # Axios instance + all API calls
│       ├── 📂 styles/
│       │   └── index.css            # Full design system
│       ├── 📂 utils/
│       │   └── helpers.js           # timeAgo, fmtDate, constants
│       ├── App.jsx                  # Routes + auth guards
│       └── index.js                 # React entry point
│
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

| Tool | Version | Link |
|------|---------|------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| MongoDB | 7+ | [mongodb.com](https://www.mongodb.com/try/download/community) |
| Git | latest | [git-scm.com](https://git-scm.com) |

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Sksahilkhan67sh/streamvault-crm.git
cd streamvault-crm
```

### Step 2 — Configure & Start the Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/streamvault_crm
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

```bash
npm install        # Install dependencies
npm run seed       # Create admin account + 6 demo leads
npm run dev        # Start backend → http://localhost:5000
```

### Step 3 — Configure & Start the Frontend

Open a **new terminal**:

```bash
cd frontend
cp .env.example .env
# REACT_APP_API_URL=http://localhost:5000/api
npm install
npm start          # Start frontend → http://localhost:3000
```

### Step 4 — Log In

Open [http://localhost:3000](http://localhost:3000) and sign in:

| Field    | Value                  |
|----------|------------------------|
| Email    | `admin@streamvault.io` |
| Password | `admin123`             |

---

## 🐳 Docker Setup

Run the entire stack — MongoDB, backend, and frontend — with a single command.

```bash
# 1. Set up environment
cp backend/.env.example backend/.env

# 2. Build and start all services
docker-compose up --build

# 3. Seed the database (first run only)
docker-compose exec backend node utils/seed.js
```

### Running Services

| Service  | URL                       |
|----------|---------------------------|
| Frontend | http://localhost:3000     |
| Backend  | http://localhost:5000     |
| MongoDB  | mongodb://localhost:27017 |

---

## 📡 API Reference

All protected routes require the header:
```
Authorization: Bearer <token>
```

### Auth Endpoints

| Method | Endpoint           | Auth | Description       |
|--------|--------------------|------|-------------------|
| POST   | `/api/auth/login`  | ❌   | Login, get token  |
| GET    | `/api/auth/me`     | ✅   | Get current admin |
| POST   | `/api/auth/logout` | ✅   | Logout            |

### Lead Endpoints

| Method | Endpoint                | Auth | Description             |
|--------|-------------------------|------|-------------------------|
| POST   | `/api/leads/contact`    | ❌   | Public contact form     |
| GET    | `/api/leads`            | ✅   | List leads (filterable) |
| GET    | `/api/leads/stats`      | ✅   | Dashboard statistics    |
| GET    | `/api/leads/export`     | ✅   | Download as CSV         |
| POST   | `/api/leads`            | ✅   | Create lead (admin)     |
| GET    | `/api/leads/:id`        | ✅   | Get single lead         |
| PUT    | `/api/leads/:id`        | ✅   | Update lead             |
| DELETE | `/api/leads/:id`        | ✅   | Delete lead             |
| PATCH  | `/api/leads/:id/status` | ✅   | Update status only      |
| POST   | `/api/leads/:id/notes`  | ✅   | Add internal note       |

### Query Parameters — `GET /api/leads`

| Parameter | Options | Default |
|-----------|---------|---------|
| `status` | `new` · `contacted` · `converted` | all |
| `source` | `Website` · `LinkedIn` · `Referral` · `Event` · `Other` | all |
| `sort` | `newest` · `oldest` · `name` · `followup` | `newest` |
| `search` | any string — name, email, or company | — |
| `page` | integer | `1` |
| `limit` | integer | `10` |

---

## ☁️ Deployment

### Step 1 — MongoDB Atlas

1. Sign up at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free **M0** cluster
3. Go to **Database Access** → add a user with a strong password
4. Go to **Network Access** → allow `0.0.0.0/0`
5. Click **Connect → Drivers** → copy connection string:
```
mongodb+srv://<user>:<password>@cluster.mongodb.net/streamvault_crm
```

---

### Step 2 — Backend on Render

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo
3. Fill in the settings:

| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `node server.js` |
| Instance Type | Free |

4. Add environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGO_URI` | your Atlas connection string |
| `JWT_SECRET` | a long random secret string |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | your Vercel URL (update after step 3) |

5. After deploy, open the Render **Shell** tab and seed the DB:
```bash
node utils/seed.js
```

---

### Step 3 — Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Set Root Directory to `frontend`
4. Add environment variable:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://your-backend.onrender.com/api` |

5. Click **Deploy**
6. Copy your Vercel URL → go back to Render → update `CLIENT_URL`

---

## 🔄 Business Workflow

```
┌──────────────────────────────────────────────┐
│                                              │
│   Visitor fills the public Contact Form      │
│                    ↓                         │
│        Lead created  →  status: new          │
│                    ↓                         │
│      Admin reviews lead in Dashboard         │
│                    ↓                         │
│     Admin contacts the lead (call/email)     │
│                    ↓                         │
│       Status updated  →  contacted           │
│    Notes added, follow-up date scheduled     │
│                    ↓                         │
│       Lead agrees to become a client         │
│                    ↓                         │
│        Status updated  →  converted  ✅      │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 🔑 Demo Credentials

```
Email:    admin@streamvault.io
Password: admin123
```

> ⚠️ Change these credentials before going to production.

---

## 📄 License

MIT © [Sahil Khan](https://github.com/Sksahilkhan67sh)

---

<div align="center">

Built with ❤️ using the MERN Stack

⭐ **Star this repo if you found it useful!**

</div>
 
