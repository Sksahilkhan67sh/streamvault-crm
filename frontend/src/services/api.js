/**
 * API Service Layer — all HTTP calls go through this module.
 * Swap REACT_APP_API_URL in .env to point at any backend.
 */
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// ── Axios instance ─────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("crm_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — clear session and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("crm_token");
      localStorage.removeItem("crm_admin");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── Auth ───────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:  (data) => api.post("/auth/login", data),
  getMe:  ()     => api.get("/auth/me"),
  logout: ()     => api.post("/auth/logout"),
};

// ── Leads (admin) ──────────────────────────────────────────────────────────────
export const leadsAPI = {
  getAll:        (params) => api.get("/leads", { params }),
  getStats:      ()       => api.get("/leads/stats"),
  getOne:        (id)     => api.get(`/leads/${id}`),
  create:        (data)   => api.post("/leads", data),
  update:        (id, d)  => api.put(`/leads/${id}`, d),
  updateStatus:  (id, s)  => api.patch(`/leads/${id}/status`, { status: s }),
  addNote:       (id, t)  => api.post(`/leads/${id}/notes`, { text: t }),
  delete:        (id)     => api.delete(`/leads/${id}`),

  // Public contact form endpoint (no auth required)
  submitContact: (data)   => api.post("/leads/contact", data),

  // Returns URL for CSV download with auth token injection
  exportCSV: () => {
    const token = localStorage.getItem("crm_token");
    return fetch(`${BASE_URL}/leads/export`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.blob())
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
      });
  },
};

export default api;
