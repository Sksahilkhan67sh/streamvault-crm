# StreamVault CRM

A production-ready **Client Lead Management System** built with the MERN stack. Capture leads from a public contact form and manage them through a full admin dashboard with status tracking, notes, follow-ups, and activity logs.

![Stack](https://img.shields.io/badge/Stack-MERN-6ee7b7?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Node](https://img.shields.io/badge/Node-20+-339933?style=for-the-badge&logo=node.js)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Docker Setup](#docker-setup)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Business Workflow](#business-workflow)

---

## Features

### Admin Dashboard
- Stats overview — Total, New, Contacted, and Converted leads with conversion rate
- Recent leads and upcoming follow-ups panels
- Source analytics — breakdown by lead origin

### Lead Management
- Full CRUD — Create, Read, Update, Delete
- Search by name, email, or company using MongoDB full-text index
- Filter by status and source
- Sort by newest, oldest, name, or follow-up date
- Pagination — 12 leads per page
- One-click CSV export

### Lead Detail
- Status transitions — `new → contacted → converted`
- Internal notes with timestamps and author
- Activity log tracking every status change and update
- Follow-up date scheduling
- Last contacted timestamp

### Security
- JWT authentication with 7-day expiry
- bcrypt password hashing at 12 rounds
- Helmet HTTP security headers
- CORS configuration
- Rate limiting — 100 requests per 15 minutes
- Input validation using express-validator
- All admin routes protected

### Public Contact Form
- No authentication required — simulates website lead capture
- Validated on both frontend (react-hook-form) and backend (express-validator)
- Auto-creates lead with `status: new`

---

## Tech Stack

| Layer      | Technology                                        |
|------------|---------------------------------------------------|
| Frontend   | React 18, React Router v6                         |
| Forms      | React Hook Form                                   |
| HTTP       | Axios with interceptors                           |
| Backend    | Node.js, Express 4                                |
| Database   | MongoDB 7, Mongoose 8                             |
| Auth       | JWT + bcryptjs                                    |
| Security   | Helmet, express-rate-limit, CORS                  |
| Validation | express-validator                                 |
| DevOps     | Docker, Docker Compose, nginx                     |

---

## Project Structure

```
streamvault-crm/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js       # Login, getMe, logout
│   │   └── lead.controller.js       # All lead operations
│   ├── middleware/
│   │   ├── auth.middleware.js       # JWT protect guard
│   │   ├── error.middleware.js      # Global error handler
│   │   └── validate.middleware.js   # express-validator runner
│   ├── models/
│   │   ├── Admin.model.js           # Admin schema + bcrypt hooks
│   │   └── Lead.model.js            # Lead schema with notes + activity
│   ├── routes/
│   │   ├── auth.routes.js           # POST /login, GET /me
│   │   └── lead.routes.js           # Full CRUD + status + notes
│   ├── utils/
│   │   └── seed.js                  # Database seeder
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── server.js                    # App entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # Spinner, Badge, EmptyState, ConfirmDialog
│   │   │   ├── dashboard/           # StatsCards, RecentLeads, UpcomingFollowUps
│   │   │   ├── layout/              # Layout, Sidebar, Topbar
│   │   │   └── leads/               # LeadsTable, LeadForm, LeadNotes,
│   │   │                            # ActivityLog, StatusToggles, Pagination
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Auth state + token verification
│   │   │   └── LeadsContext.jsx     # Leads CRUD state
│   │   ├── hooks/
│   │   │   ├── useDebounce.js       # Search debounce
│   │   │   └── useLeadFilters.js    # Filter/sort/pagination state
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LeadsPage.jsx
│   │   │   ├── LeadDetailPage.jsx
│   │   │   └── ContactPage.jsx      # Public contact form
│   │   ├── services/
│   │   │   └── api.js               # Axios instance + all API calls
│   │   ├── styles/
│   │   │   └── index.css            # Full design system
│   │   ├── utils/
│   │   │   └── helpers.js           # timeAgo, fmtDate, constants
│   │   ├── App.jsx                  # Routes + guards
│   │   └── index.js                 # React entry point
│   ├── .env.example
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI
- Git

### 1 — Clone the repository

```bash
git clone https://github.com/Sksahilkhan67sh/streamvault-crm.git
cd streamvault-crm
```

### 2 — Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env — set your MONGO_URI and JWT_SECRET
npm install
npm run seed      # Creates admin account + 6 demo leads
npm run dev       # Runs on http://localhost:5000
```

### 3 — Frontend setup

Open a second terminal:

```bash
cd frontend
cp .env.example .env
# REACT_APP_API_URL=http://localhost:5000/api
npm install
npm start         # Runs on http://localhost:3000
```

### 4 — Log in

| Field    | Value                 |
|----------|-----------------------|
| Email    | admin@streamvault.io  |
| Password | admin123              |

---

## Docker Setup

Runs MongoDB, backend, and frontend together with a single command.

```bash
# Copy and configure environment
cp backend/.env.example backend/.env

# Build and start all services
docker-compose up --build

# Seed the database (first run only)
docker-compose exec backend node utils/seed.js
```

| Service   | URL                        |
|-----------|----------------------------|
| Frontend  | http://localhost:3000      |
| Backend   | http://localhost:5000      |
| MongoDB   | mongodb://localhost:27017  |

---

## API Reference

All protected routes require an `Authorization: Bearer <token>` header.

### Auth Endpoints

| Method | Endpoint           | Auth | Description      |
|--------|--------------------|------|------------------|
| POST   | `/api/auth/login`  | No   | Login, get token |
| GET    | `/api/auth/me`     | Yes  | Current admin    |
| POST   | `/api/auth/logout` | Yes  | Logout           |

### Lead Endpoints

| Method | Endpoint                  | Auth | Description             |
|--------|---------------------------|------|-------------------------|
| POST   | `/api/leads/contact`      | No   | Public contact form     |
| GET    | `/api/leads`              | Yes  | List leads (filterable) |
| GET    | `/api/leads/stats`        | Yes  | Dashboard statistics    |
| GET    | `/api/leads/export`       | Yes  | Download CSV            |
| POST   | `/api/leads`              | Yes  | Create lead (admin)     |
| GET    | `/api/leads/:id`          | Yes  | Get single lead         |
| PUT    | `/api/leads/:id`          | Yes  | Update lead             |
| DELETE | `/api/leads/:id`          | Yes  | Delete lead             |
| PATCH  | `/api/leads/:id/status`   | Yes  | Update status only      |
| POST   | `/api/leads/:id/notes`    | Yes  | Add note                |

### Query Parameters — `GET /api/leads`

| Param    | Values                                    | Default |
|----------|-------------------------------------------|---------|
| `status` | `new`, `contacted`, `converted`           | all     |
| `source` | `Website`, `LinkedIn`, `Referral`, etc.   | all     |
| `sort`   | `newest`, `oldest`, `followup`, `name`    | newest  |
| `search` | any string — name, email, or company      | —       |
| `page`   | integer                                   | 1       |
| `limit`  | integer                                   | 10      |

---

## Deployment

### Step 1 — MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user with a strong password
3. Allow network access from anywhere (`0.0.0.0/0`)
4. Copy your connection string:
   ```
   mongodb+srv://<user>:<password>@cluster.mongodb.net/streamvault_crm
   ```

### Step 2 — Backend on Render

1. Go to [render.com](https://render.com) and create a **Web Service**
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add these environment variables:

| Key             | Value                          |
|-----------------|--------------------------------|
| `NODE_ENV`      | `production`                   |
| `PORT`          | `5000`                         |
| `MONGO_URI`     | your Atlas connection string   |
| `JWT_SECRET`    | a long random secret string    |
| `JWT_EXPIRES_IN`| `7d`                           |
| `CLIENT_URL`    | your Vercel frontend URL       |

7. After deploy, open the Render **Shell** tab and run:
   ```bash
   node utils/seed.js
   ```

### Step 3 — Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and import your GitHub repo
2. Set **Root Directory** to `frontend`
3. Add this environment variable:

| Key                    | Value                                          |
|------------------------|------------------------------------------------|
| `REACT_APP_API_URL`    | `https://your-backend.onrender.com/api`        |

4. Click **Deploy**

---

## Business Workflow

```
Visitor fills Contact Form
        ↓
Lead created with status: new
        ↓
Admin reviews in Dashboard
        ↓
Admin calls or emails the lead
        ↓
Status updated → contacted
Notes and follow-up date added
        ↓
Lead signs up as a client
        ↓
Status updated → converted ✅
```

---

## Demo Credentials

```
Email:    admin@streamvault.io
Password: admin123
```

---

## License

MIT © StreamVault CRM
 
