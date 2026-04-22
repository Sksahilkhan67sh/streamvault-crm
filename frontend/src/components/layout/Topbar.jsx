import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const TITLES = {
  "/":        "Dashboard",
  "/leads":   "Lead Management",
  "/contact": "Contact Form",
};

export default function Topbar() {
  const { pathname } = useLocation();
  const { admin } = useAuth();

  const title = TITLES[pathname] ||
    (pathname.startsWith("/leads/") ? "Lead Detail" : "StreamVault CRM");

  const now = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

  return (
    <header className="topbar">
      <div className="topbar-title">{title}</div>
      <div className="topbar-actions">
        <div style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>{now}</div>
        <div style={{ width: 1, height: 20, background: "var(--border2)" }} />
        <div style={{ fontSize: 13, color: "var(--text2)", fontWeight: 500 }}>
          {admin?.name}
        </div>
      </div>
    </header>
  );
}
