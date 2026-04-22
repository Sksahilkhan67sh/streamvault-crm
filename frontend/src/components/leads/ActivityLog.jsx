import { timeAgo } from "../../utils/helpers";

export default function ActivityLog({ activity = [] }) {
  const items = [...activity].reverse().slice(0, 10);
  if (items.length === 0) return (
    <div style={{ fontSize: 13, color: "var(--text3)" }}>No activity recorded yet.</div>
  );
  return (
    <div className="activity-list">
      {items.map((a) => (
        <div className="activity-item" key={a._id}>
          <div className="activity-dot" />
          <div className="activity-body">
            <div className="activity-text">{a.text}</div>
            <div className="activity-time">{timeAgo(a.createdAt)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
