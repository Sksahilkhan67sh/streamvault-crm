import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLeads } from "../../context/LeadsContext";
import Icon from "../common/Icon";

const NAV = [
  { to: "/",       label: "Dashboard",    icon: "dashboard", exact: true },
  { to: "/leads",  label: "All Leads",    icon: "users" },
  { to: "/contact",label: "Contact Form", icon: "globe" },
];

export default function Sidebar() {
  const { admin, logout } = useAuth();
  const { stats } = useLeads();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">SV</div>
        <div className="logo-text">Stream<span>Vault</span></div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group-label">Main</div>
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.exact}
            className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
            style={{ textDecoration: "none" }}
          >
            <Icon name={n.icon} size={15} />
            {n.label}
            {n.to === "/leads" && stats.new > 0 && (
              <span className="nav-badge">{stats.new}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card" onClick={handleLogout} title="Sign out">
          <div className="user-avatar">
            {admin?.name?.charAt(0) || "A"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name">{admin?.name || "Admin"}</div>
            <div className="user-role">Click to sign out</div>
          </div>
          <Icon name="logout" size={14} style={{ color: "var(--text3)" }} />
        </div>
      </div>
    </aside>
  );
}
