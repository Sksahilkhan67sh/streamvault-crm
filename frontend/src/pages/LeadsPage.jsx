import { useEffect, useState } from "react";
import { useLeads } from "../context/LeadsContext";
import { useLeadFilters } from "../hooks/useLeadFilters";
import { useDebounce } from "../hooks/useDebounce";
import LeadsTable from "../components/leads/LeadsTable";
import LeadForm from "../components/leads/LeadForm";
import Pagination from "../components/leads/Pagination";
import Icon from "../components/common/Icon";
import { SOURCES, STATUSES, cap } from "../utils/helpers";
import toast from "react-hot-toast";

export default function LeadsPage() {
  const { leads, pagination, loading, fetchLeads, createLead, exportCSV } = useLeads();
  const { filters, setFilter, toParams } = useLeadFilters();
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const debouncedSearch = useDebounce(filters.search, 350);

  // Refetch whenever filters change
  useEffect(() => {
    fetchLeads(toParams());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters.status, filters.source, filters.sort, filters.page]);

  const handleCreate = async (data) => {
    setFormLoading(true);
    try {
      await createLead(data);
      setShowForm(false);
      fetchLeads(toParams());
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to create lead");
    } finally {
      setFormLoading(false);
    }
  };

  const handleSort = (field) => {
    const map = { name: "name", newest: "oldest", oldest: "newest", followup: "followup" };
    setFilter("sort", filters.sort === field ? map[field] : field);
  };

  return (
    <div className="slide-up">
      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon"><Icon name="search" size={14} /></span>
          <input
            className="search-input"
            placeholder="Search name, email, company…"
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
          />
        </div>

        <select className="filter-select" value={filters.status} onChange={(e) => setFilter("status", e.target.value)}>
          <option value="all">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{cap(s)}</option>)}
        </select>

        <select className="filter-select" value={filters.source} onChange={(e) => setFilter("source", e.target.value)}>
          <option value="all">All Sources</option>
          {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select className="filter-select" value={filters.sort} onChange={(e) => setFilter("sort", e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="followup">By Follow-up</option>
          <option value="name">By Name</option>
        </select>

        <div className="toolbar-right">
          <button className="btn btn-secondary btn-sm" onClick={exportCSV}>
            <Icon name="download" size={13} /> Export CSV
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
            <Icon name="plus" size={13} /> New Lead
          </button>
        </div>
      </div>

      {/* Table */}
      <LeadsTable
        leads={leads}
        loading={loading}
        sort={filters.sort}
        onSort={handleSort}
      />

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          limit={12}
          onChange={(p) => setFilter("page", p)}
        />
      )}

      {/* Create modal */}
      {showForm && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal slide-up">
            <div className="modal-header">
              <div className="modal-title">New Lead</div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowForm(false)}>
                <Icon name="x" size={16} />
              </button>
            </div>
            <LeadForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
              loading={formLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}
