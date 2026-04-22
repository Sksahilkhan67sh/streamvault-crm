import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { leadsAPI } from "../services/api";
import { useLeads } from "../context/LeadsContext";
import StatusToggles from "../components/leads/StatusToggles";
import LeadNotes from "../components/leads/LeadNotes";
import ActivityLog from "../components/leads/ActivityLog";
import LeadForm from "../components/leads/LeadForm";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Icon from "../components/common/Icon";
import Badge from "../components/common/Badge";
import Spinner from "../components/common/Spinner";
import { timeAgo, fmtDate, initials } from "../utils/helpers";
import toast from "react-hot-toast";

export default function LeadDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { updateStatus, addNote, updateLead, deleteLead } = useLeads();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const fetchLead = useCallback(async () => {
    try {
      const { data } = await leadsAPI.getOne(id);
      setLead(data.lead);
    } catch {
      toast.error("Lead not found");
      nav("/leads");
    } finally {
      setLoading(false);
    }
  }, [id, nav]);

  useEffect(() => { fetchLead(); }, [fetchLead]);

  const handleStatusChange = async (status) => {
    setStatusLoading(true);
    try {
      await updateStatus(id, status);
      setLead((l) => ({ ...l, status, lastContactedAt: new Date().toISOString(), activity: [...(l.activity || []), { _id: Date.now(), text: `Status changed to "${status}"`, createdAt: new Date().toISOString() }] }));
    } finally {
      setStatusLoading(false);
    }
  };

  const handleAddNote = async (text) => {
    const updated = await addNote(id, text);
    setLead(updated);
  };

  const handleEdit = async (data) => {
    setEditLoading(true);
    try {
      const updated = await updateLead(id, data);
      setLead(updated);
      setEditOpen(false);
    } catch (e) {
      toast.error(e.response?.data?.message || "Update failed");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    await deleteLead(id);
    nav("/leads");
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}><Spinner size="lg" /></div>;
  if (!lead) return null;

  const infoItems = [
    { key: "Email",        val: lead.email,   icon: "mail" },
    { key: "Phone",        val: lead.phone || "—", icon: "phone" },
    { key: "Company",      val: lead.company || "—", icon: "building" },
    { key: "Source",       val: <Badge status={lead.source} type="source" />, icon: "globe" },
    { key: "Follow-up",    val: fmtDate(lead.followUpDate), icon: "calendar" },
    { key: "Last Contact", val: timeAgo(lead.lastContactedAt), icon: "activity" },
    { key: "Created",      val: timeAgo(lead.createdAt), icon: "activity" },
    { key: "Updated",      val: timeAgo(lead.updatedAt), icon: "activity" },
  ];

  return (
    <div className="slide-up" style={{ maxWidth: 900 }}>
      {/* Back */}
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => nav("/leads")}>
        <Icon name="arrowLeft" size={14} /> Back to Leads
      </button>

      {/* Header card */}
      <div className="table-card" style={{ marginBottom: 16, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {/* Avatar */}
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              background: "linear-gradient(135deg, var(--accent2), var(--accent))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 18, color: "#fff",
            }}>
              {initials(lead.name)}
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 22 }}>{lead.name}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap", alignItems: "center" }}>
                <Badge status={lead.status} />
                <span style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>{lead.email}</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditOpen(true)}>
              <Icon name="edit" size={13} /> Edit
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(true)}>
              <Icon name="trash" size={13} /> Delete
            </button>
          </div>
        </div>

        {/* Status */}
        <div style={{ marginTop: 20 }}>
          <div className="section-heading">Status</div>
          <StatusToggles current={lead.status} onChange={handleStatusChange} loading={statusLoading} />
        </div>

        {/* Info grid */}
        <div className="section-heading">Contact Details</div>
        <div className="info-grid">
          {infoItems.map(({ key, val }) => (
            <div className="info-item" key={key}>
              <div className="info-key">{key}</div>
              <div className="info-val">{val}</div>
            </div>
          ))}
          {lead.message && (
            <div className="info-item" style={{ gridColumn: "1 / -1" }}>
              <div className="info-key">Message / Inquiry</div>
              <div className="info-val" style={{ color: "var(--text2)", lineHeight: 1.6, fontSize: 13.5 }}>{lead.message}</div>
            </div>
          )}
        </div>
      </div>

      {/* Notes + Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="table-card" style={{ padding: 20 }}>
          <div className="section-heading">
            Notes ({lead.notes?.length || 0})
          </div>
          <LeadNotes notes={lead.notes} onAdd={handleAddNote} />
        </div>

        <div className="table-card" style={{ padding: 20 }}>
          <div className="section-heading">Activity Log</div>
          <ActivityLog activity={lead.activity} />
        </div>
      </div>

      {/* Edit modal */}
      {editOpen && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setEditOpen(false)}>
          <div className="modal slide-up">
            <div className="modal-header">
              <div className="modal-title">Edit Lead</div>
              <button className="btn btn-ghost btn-icon" onClick={() => setEditOpen(false)}>
                <Icon name="x" size={16} />
              </button>
            </div>
            <LeadForm
              defaultValues={{
                name: lead.name, email: lead.email, phone: lead.phone || "",
                company: lead.company || "", source: lead.source,
                message: lead.message || "",
                followUpDate: lead.followUpDate ? lead.followUpDate.slice(0, 10) : "",
                _id: lead._id,
              }}
              onSubmit={handleEdit}
              onCancel={() => setEditOpen(false)}
              loading={editLoading}
            />
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete Lead"
          message={`Are you sure you want to delete the lead for ${lead.name}? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
          danger
        />
      )}
    </div>
  );
}
