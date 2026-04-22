export default function Pagination({ page, pages, total, limit, onChange }) {
  if (pages <= 1) return null;
  const from = (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);

  // Show max 7 page buttons with ellipsis logic
  const getPages = () => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    if (page <= 4) return [1,2,3,4,5,"…",pages];
    if (page >= pages - 3) return [1,"…",pages-4,pages-3,pages-2,pages-1,pages];
    return [1,"…",page-1,page,page+1,"…",pages];
  };

  return (
    <div className="pagination">
      <div className="page-info">Showing {from}–{to} of {total}</div>
      <div className="page-btns">
        <button className="page-btn" disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button>
        {getPages().map((p, i) =>
          p === "…"
            ? <span key={`e${i}`} style={{ padding: "0 4px", color: "var(--text3)", display: "flex", alignItems: "center" }}>…</span>
            : <button key={p} className={`page-btn${page === p ? " active" : ""}`} onClick={() => onChange(p)}>{p}</button>
        )}
        <button className="page-btn" disabled={page === pages} onClick={() => onChange(page + 1)}>›</button>
      </div>
    </div>
  );
}
