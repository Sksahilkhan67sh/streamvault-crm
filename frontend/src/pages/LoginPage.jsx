import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "admin@streamvault.io", password: "admin123" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handle = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-mark">SV</div>
          <div>
            <div className="login-heading">
              Stream<span style={{ color: "var(--accent)" }}>Vault</span>
            </div>
            <div className="login-sub">CRM Admin Portal</div>
          </div>
        </div>

        <form className="login-form" onSubmit={handle} noValidate>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={f("email")}
              placeholder="admin@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={f("password")}
              placeholder="••••••••"
              required
            />
          </div>

          {err && (
            <div style={{ background: "rgba(244,63,94,.1)", border: "1px solid rgba(244,63,94,.25)", borderRadius: "var(--radius)", padding: "10px 14px", fontSize: 13, color: "var(--accent4)" }}>
              {err}
            </div>
          )}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", padding: "11px", fontSize: 14 }}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <div className="login-hint">
          Demo credentials pre-filled above.<br />
          email: admin@streamvault.io · password: admin123
        </div>
      </div>
    </div>
  );
}
