import { useForm } from "react-hook-form";
import { SOURCES } from "../../utils/helpers";

export default function LeadForm({ defaultValues = {}, onSubmit, onCancel, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="modal-body">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              className="form-input"
              placeholder="Rohan Mehta"
              {...register("name", { required: "Name is required", maxLength: { value: 100, message: "Max 100 chars" } })}
            />
            {errors.name && <div className="form-error">{errors.name.message}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              className="form-input"
              type="email"
              placeholder="rohan@company.com"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
              })}
            />
            {errors.email && <div className="form-error">{errors.email.message}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" placeholder="+91 98765 43210" {...register("phone", { maxLength: { value: 20, message: "Max 20 chars" } })} />
            {errors.phone && <div className="form-error">{errors.phone.message}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Company</label>
            <input className="form-input" placeholder="Acme Corp" {...register("company")} />
          </div>

          <div className="form-group">
            <label className="form-label">Lead Source</label>
            <select className="form-select" {...register("source")}>
              {SOURCES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Follow-up Date</label>
            <input className="form-input" type="date" {...register("followUpDate")} />
          </div>

          <div className="form-group form-full">
            <label className="form-label">Message / Inquiry</label>
            <textarea
              className="form-textarea"
              placeholder="Describe the lead's inquiry or notes…"
              rows={3}
              {...register("message", { maxLength: { value: 2000, message: "Max 2000 chars" } })}
            />
            {errors.message && <div className="form-error">{errors.message.message}</div>}
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving…" : defaultValues._id ? "Save Changes" : "Create Lead"}
        </button>
      </div>
    </form>
  );
}
