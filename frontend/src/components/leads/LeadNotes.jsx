import { useState } from "react";
import Icon from "../common/Icon";
import { timeAgo } from "../../utils/helpers";

export default function LeadNotes({ notes = [], onAdd, loading }) {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try { await onAdd(text.trim()); setText(""); }
    finally { setSaving(false); }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAdd();
  };

  return (
    <div>
      {notes.length > 0 && (
        <div className="notes-list">
          {[...notes].reverse().map((n) => (
            <div className="note-item" key={n._id}>
              <div className="note-text">{n.text}</div>
              <div className="note-meta">{n.author} · {timeAgo(n.createdAt)}</div>
            </div>
          ))}
        </div>
      )}
      <div className="add-note-row">
        <textarea
          className="form-textarea"
          style={{ minHeight: 56 }}
          placeholder="Add a note… (Ctrl+Enter to save)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          rows={2}
        />
        <button
          className="btn btn-secondary btn-sm"
          style={{ whiteSpace: "nowrap", alignSelf: "flex-end" }}
          onClick={handleAdd}
          disabled={saving || !text.trim()}
        >
          <Icon name="note" size={13} />
          {saving ? "Saving…" : "Add Note"}
        </button>
      </div>
      {notes.length === 0 && (
        <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 8 }}>
          No notes yet. Add the first one above.
        </div>
      )}
    </div>
  );
}
