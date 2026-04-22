import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLeads } from "../context/LeadsContext";
import StatsCards from "../components/dashboard/StatsCards";
import RecentLeads from "../components/dashboard/RecentLeads";
import UpcomingFollowUps from "../components/dashboard/UpcomingFollowUps";
import Spinner from "../components/common/Spinner";

export default function DashboardPage() {
  const { leads, stats, loading, fetchLeads } = useLeads();

  useEffect(() => { fetchLeads({ limit: 20, sort: "newest" }); }, [fetchLeads]);

  const recent    = [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
  const upcoming  = leads
    .filter((l) => l.followUpDate && new Date(l.followUpDate) >= new Date())
    .sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate))
    .slice(0, 5);

  if (loading && leads.length === 0) return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
      <Spinner size="lg" />
    </div>
  );

  return (
    <div className="slide-up">
      <StatsCards stats={stats} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <RecentLeads leads={recent} />
        <UpcomingFollowUps items={upcoming} />
      </div>

      {/* Source breakdown */}
      {leads.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div className="table-card">
            <div className="table-card-header">
              <div className="table-card-title">Leads by Source</div>
            </div>
            <div style={{ padding: "16px 20px", display: "flex", gap: 10, flexWrap: "wrap" }}>
              {(() => {
                const counts = leads.reduce((acc, l) => {
                  acc[l.source] = (acc[l.source] || 0) + 1;
                  return acc;
                }, {});
                return Object.entries(counts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([src, count]) => (
                    <div key={src} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "10px 16px", display: "flex", flexDirection: "column", gap: 2 }}>
                      <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".05em" }}>{src}</div>
                      <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 22, color: "var(--text)" }}>{count}</div>
                    </div>
                  ));
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
