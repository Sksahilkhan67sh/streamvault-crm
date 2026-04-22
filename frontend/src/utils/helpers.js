export const timeAgo = (ts) => {
  if (!ts) return "—";
  const diff = Date.now() - new Date(ts).getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

export const fmtDate = (s) =>
  s ? new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

export const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
export const truncate = (s, n = 60) => (s && s.length > n ? s.slice(0, n) + "…" : s);
export const initials = (name) =>
  name ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "?";

export const SOURCES = ["Website", "LinkedIn", "Referral", "Cold Email", "Social Media", "Event", "Other"];
export const STATUSES = ["new", "contacted", "converted"];
