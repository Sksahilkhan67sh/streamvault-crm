import { useNavigate } from "react-router-dom";
import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";
import { timeAgo } from "../../utils/helpers";

export default function RecentLeads({ leads }) {
  const nav = useNavigate();
  return (
    <div className="table-card">
      <div className="table-card-header">
        <div className="table-card-title">Recent Leads</div>
        <button className="btn btn-ghost btn-sm" onClick={() => nav("/leads")} style={{ fontSize: 12 }}>
          View all →
        </button>
      </div>
      {leads.length === 0 ? (
        <EmptyState icon="📭" title="No leads yet" sub="Submit the contact form to get started" />
      ) : (
        <table className="data-table">
          <tbody>
            {leads.map((l) => (
              <tr key={l._id} onClick={() => nav(`/leads/${l._id}`)}>
                <td>
                  <div className="lead-name">{l.name}</div>
                  <div className="lead-company">{l.company || "—"}</div>
                </td>
                <td><Badge status={l.status} /></td>
                <td style={{ color: "var(--text3)", fontSize: 12, fontFamily: "var(--font-mono)" }}>
                  {timeAgo(l.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
