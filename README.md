A production-ready **Client Lead Management System** built with the MERN stack. Capture leads from a public contact form, manage them through a full admin dashboard with status tracking, notes, follow-ups, and activity logs.

![StreamVault CRM](https://img.shields.io/badge/Stack-MERN-6ee7b7?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Node](https://img.shields.io/badge/Node-20+-339933?style=for-the-badge&logo=node.js)

---

## Features

### Admin Dashboard
- **Stats overview** — Total, New, Contacted, Converted leads with conversion rate
- **Recent leads** + **upcoming follow-ups** panels
- **Source analytics** — breakdown by lead origin

### Lead Management
- Full CRUD (Create, Read, Update, Delete)
- **Search** by name, email, or company (MongoDB full-text index)
- **Filter** by status and source
- **Sort** by newest, oldest, name, or follow-up date
- **Pagination** (12 per page)
- **CSV export** with one click

### Lead Detail
- Status transitions: `new → contacted → converted`
- Internal **notes** with timestamps and author
- **Activity log** tracking every status change and update
- Follow-up date scheduling
- Last contacted timestamp

### Security
- JWT authentication (7-day expiry)
- bcrypt password hashing (12 rounds)
- Helmet HTTP headers
- CORS configuration
- Rate limiting (100 req / 15 min)
- Input validation with express-validator
- Protected API routes

### Public Contact Form
- No auth required — simulates website lead capture
- Validated on both frontend (react-hook-form) and backend (express-validator)
- Auto-creates lead with `status: new`

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, React Router v6         |
| Forms      | React Hook Form                   |
| HTTP       | Axios with interceptors           |
| Backend    | Node.js, Express 4                |
| Database   | MongoDB 7, Mongoose 8             |
| Auth       | JWT + bcryptjs                    |
| Security   | Helmet, express-rate-limit, CORS  |
| Validation | express-validator                 |
| DevOps     | Docker, Docker Compose, nginx     |

---

## Project Structure

```
streamvault-crm/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js     # Login, getMe, logout
│   │   └── lead.controller.js     # All 8 lead operations
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT protect guard
│   │   ├── error.middleware.js    # Global error handler
│   │   └── validate.middleware.js # express-validator runner
│   ├── models/
│   │   ├── Admin.model.js         # Admin schema + bcrypt hooks
│   │   └── Lead.model.js          # Lead schema with notes + activity
│   ├── routes/
│   │   ├── auth.routes.js         # POST /login, GET /me
│   │   └── lead.routes.js         # Full CRUD + status + notes
│   ├── utils/
│   │   └── seed.js                # DB seeder
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── server.js                  # App entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── common/            # Icon, Spinner, Badge, EmptyState, ConfirmDialog
│   │   │   ├── dashboard/         # StatsCards, RecentLeads, UpcomingFollowUps
│   │   │   ├── layout/            # Layout, Sidebar, Topbar
│   │   │   └── leads/             # LeadsTable, LeadForm, LeadNotes, ActivityLog,
│   │   │                          # StatusToggles, Pagination
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Auth state + token verification
│   │   │   └── LeadsContext.jsx   # Leads CRUD state
│   │   ├── hooks/
│   │   │   ├── useDebounce.js     # Search debounce
│   │   │   └── useLeadFilters.js  # Filter/sort/pagination state
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LeadsPage.jsx
│   │   │   ├── LeadDetailPage.jsx
│   │   │   └── ContactPage.jsx    # Public form
│   │   ├── services/
│   │   │   └── api.js             # Axios instance + all API calls
│   │   ├── styles/
│   │   │   └── index.css          # Full design system
│   │   ├── utils/
│   │   │   └── helpers.js         # timeAgo, fmtDate, constants
│   │   ├── App.jsx                # Routes + guards
│   │   └── index.js               # React entry
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

## Quick Start (Local)

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) or MongoDB Atlas URI

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/streamvault-crm.git
cd streamvault-crm
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET
npm install
npm run seed      # Creates admin + 6 demo leads
npm run dev       # Starts on http://localhost:5000
```

### 3. Frontend setup

```bash
cd frontend
cp .env.example .env
# REACT_APP_API_URL=http://localhost:5000/api
npm install
npm start         # Starts on http://localhost:3000
```

### 4. Log in

| Field    | Value                    |
|----------|--------------------------|
| Email    | admin@streamvault.io     |
| Password | admin123                 |

---

## Docker (Recommended)

Runs MongoDB + backend + frontend in one command:

```bash
# Copy and edit environment
cp backend/.env.example backend/.env

# Start all services
docker-compose up --build

# Seed database (first run only)
docker-compose exec backend node utils/seed.js
```

| Service   | URL                       |
|-----------|---------------------------|
| Frontend  | http://localhost:3000     |
| Backend   | http://localhost:5000     |
| MongoDB   | mongodb://localhost:27017 |

---

## API Reference

All protected routes require `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint          | Auth | Description       |
|--------|-------------------|------|-------------------|
| POST   | `/api/auth/login` | No   | Login, get token  |
| GET    | `/api/auth/me`    | Yes  | Current admin     |
| POST   | `/api/auth/logout`| Yes  | Logout            |

### Leads

| Method | Endpoint                    | Auth | Description              |
|--------|-----------------------------|------|--------------------------|
| POST   | `/api/leads/contact`        | No   | Public contact form      |
| GET    | `/api/leads`                | Yes  | List leads (filterable)  |
| GET    | `/api/leads/stats`          | Yes  | Dashboard statistics     |
| GET    | `/api/leads/export`         | Yes  | Download CSV             |
| POST   | `/api/leads`                | Yes  | Create lead (admin)      |
| GET    | `/api/leads/:id`            | Yes  | Get single lead          |
| PUT    | `/api/leads/:id`            | Yes  | Update lead              |
| DELETE | `/api/leads/:id`            | Yes  | Delete lead              |
| PATCH  | `/api/leads/:id/status`     | Yes  | Update status only       |
| POST   | `/api/leads/:id/notes`      | Yes  | Add note                 |

#### Query parameters for `GET /api/leads`

| Param    | Values                              | Default  |
|----------|-------------------------------------|----------|
| `status` | `new`, `contacted`, `converted`     | all      |
| `source` | `Website`, `LinkedIn`, etc.         | all      |
| `sort`   | `newest`, `oldest`, `followup`, `name` | newest |
| `search` | any string (name / email / company) | —        |
| `page`   | integer                             | 1        |
| `limit`  | integer                             | 10       |

---

## Deployment

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo, set root to `backend/`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables from `.env.example`

### Frontend → Vercel

```bash
cd frontend
npm run build
npx vercel --prod
# Set REACT_APP_API_URL to your Render backend URL
```

### MongoDB → Atlas

1. Create a free cluster on [mongodb.com/atlas](https://mongodb.com/atlas)
2. Copy the connection string into `MONGO_URI` in your backend env

---

## Business Workflow

```
Visitor → Contact Form → Lead (status: new)
                              ↓
                    Admin reviews in dashboard
                              ↓
                    Admin calls / emails lead
                              ↓
                    Status → contacted
                    Notes + follow-up date set
                              ↓
                    Lead becomes a client
                              ↓
                    Status → converted ✅
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
#

## License

MIT © StreamVault CRM
#   s t r e a m v a u l t - c r m 
 
 
