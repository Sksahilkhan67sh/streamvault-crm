import { useNavigate } from "react-router-dom";
import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";
import Icon from "../common/Icon";
import { timeAgo, fmtDate } from "../../utils/helpers";

export default function LeadsTable({ leads, loading, sort, onSort }) {
  const nav = useNavigate();

  const Th = ({ field, children }) => (
    <th className={sort === field ? "sorted" : ""} onClick={() => onSort(field)}>
      {children} {sort === field && "↓"}
    </th>
  );

  if (loading) {
    return (
      <div className="table-card">
        <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>
          <div className="spinner spinner-lg" style={{ margin: "0 auto 12px" }} />
          Loading leads…
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      {leads.length === 0 ? (
        <EmptyState icon="🔍" title="No leads found" sub="Try adjusting your search or filters" />
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <Th field="name">Lead</Th>
              <th>Company</th>
              <th>Source</th>
              <th>Status</th>
              <Th field="followup">Follow-up</Th>
              <Th field="newest">Created</Th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l._id} onClick={() => nav(`/leads/${l._id}`)}>
                <td>
                  <div className="lead-name">{l.name}</div>
                  <div className="lead-email">{l.email}</div>
                </td>
                <td className="lead-company">{l.company || "—"}</td>
                <td><Badge status={l.source} type="source" /></td>
                <td><Badge status={l.status} /></td>
                <td>
                  {l.followUpDate ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--accent3)", fontSize: 12, fontFamily: "var(--font-mono)" }}>
                      <Icon name="calendar" size={11} />{fmtDate(l.followUpDate)}
                    </span>
                  ) : <span style={{ color: "var(--text3)" }}>—</span>}
                </td>
                <td style={{ color: "var(--text3)", fontSize: 12, fontFamily: "var(--font-mono)" }}>
                  {timeAgo(l.createdAt)}
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => nav(`/leads/${l._id}`)}
                    title="View lead"
                  >
                    <Icon name="eye" size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
