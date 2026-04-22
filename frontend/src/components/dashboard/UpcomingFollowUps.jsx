import { useNavigate } from "react-router-dom";
import Icon from "../common/Icon";
import EmptyState from "../common/EmptyState";
import { fmtDate } from "../../utils/helpers";

export default function UpcomingFollowUps({ items }) {
  const nav = useNavigate();
  return (
    <div className="table-card">
      <div className="table-card-header">
        <div className="table-card-title">Upcoming Follow-ups</div>
      </div>
      {items.length === 0 ? (
        <EmptyState icon="📅" title="No upcoming follow-ups" sub="Set follow-up dates on leads" />
      ) : (
        <table className="data-table">
          <tbody>
            {items.map((l) => (
              <tr key={l._id} onClick={() => nav(`/leads/${l._id}`)}>
                <td>
                  <div className="lead-name">{l.name}</div>
                  <div className="lead-company">{l.company || "—"}</div>
                </td>
                <td>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--accent3)", fontSize: 12, fontFamily: "var(--font-mono)" }}>
                    <Icon name="calendar" size={11} />
                    {fmtDate(l.followUpDate)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
