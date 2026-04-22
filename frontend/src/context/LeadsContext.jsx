import { createContext, useContext, useState, useCallback } from "react";
import { leadsAPI } from "../services/api";
import toast from "react-hot-toast";

const LeadsContext = createContext(null);
export const useLeads = () => useContext(LeadsContext);

export function LeadsProvider({ children }) {
  const [leads, setLeads]           = useState([]);
  const [stats, setStats]           = useState({ total: 0, new: 0, contacted: 0, converted: 0 });
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading]       = useState(false);

  // ── Fetch leads list ──────────────────────────────────────────────────────
  const fetchLeads = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await leadsAPI.getAll(params);
      const d   = res.data;
      setLeads(d.leads || []);
      setPagination({ total: d.total, page: d.page, pages: d.pages });

      // Also fetch fresh stats
      const statsRes = await leadsAPI.getStats();
      setStats(statsRes.data.stats);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const createLead = useCallback(async (formData) => {
    const res = await leadsAPI.create(formData);
    toast.success("Lead created!");
    return res.data.lead;
  }, []);

  const updateLead = useCallback(async (id, formData) => {
    const res = await leadsAPI.update(id, formData);
    setLeads((prev) => prev.map((l) => (l._id === id ? res.data.lead : l)));
    toast.success("Lead updated!");
    return res.data.lead;
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    const res = await leadsAPI.updateStatus(id, status);
    setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status } : l)));
    setStats((prev) => {
      const lead = leads.find((l) => l._id === id);
      if (!lead) return prev;
      return { ...prev, [lead.status]: Math.max(0, prev[lead.status] - 1), [status]: (prev[status] || 0) + 1 };
    });
    toast.success(`Status → ${status}`);
    return res.data.lead;
  }, [leads]);

  const addNote = useCallback(async (id, text) => {
    const res = await leadsAPI.addNote(id, text);
    toast.success("Note added");
    return res.data.lead;
  }, []);

  const deleteLead = useCallback(async (id) => {
    await leadsAPI.delete(id);
    setLeads((prev) => prev.filter((l) => l._id !== id));
    setStats((prev) => {
      const lead = leads.find((l) => l._id === id);
      if (!lead) return prev;
      return { ...prev, total: prev.total - 1, [lead.status]: Math.max(0, prev[lead.status] - 1) };
    });
    toast.success("Lead deleted");
  }, [leads]);

  const exportCSV = useCallback(async () => {
    try {
      await leadsAPI.exportCSV();
      toast.success("CSV downloaded!");
    } catch {
      toast.error("Export failed");
    }
  }, []);

  return (
    <LeadsContext.Provider value={{
      leads, stats, pagination, loading,
      fetchLeads, createLead, updateLead, updateStatus, addNote, deleteLead, exportCSV,
    }}>
      {children}
    </LeadsContext.Provider>
  );
}
