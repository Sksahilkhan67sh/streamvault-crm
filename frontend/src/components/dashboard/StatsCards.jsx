export default function StatsCards({ stats }) {
  const cards = [
    { label: "Total Leads",  val: stats.total,     sub: "All time",          color: "c-blue"  },
    { label: "New",          val: stats.new,        sub: "Awaiting action",   color: "c-rose"  },
    { label: "Contacted",    val: stats.contacted,  sub: "In progress",       color: "c-amber" },
    { label: "Converted",    val: stats.converted,  sub: `${stats.total ? Math.round(stats.converted / stats.total * 100) : 0}% rate`, color: "c-green" },
  ];
  return (
    <div className="stats-grid">
      {cards.map((c) => (
        <div key={c.label} className={`stat-card ${c.color}`}>
          <div className="stat-label">{c.label}</div>
          <div className="stat-val">{c.val ?? 0}</div>
          <div className="stat-sub">{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
