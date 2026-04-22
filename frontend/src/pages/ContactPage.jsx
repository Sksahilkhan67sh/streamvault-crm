import { useState } from "react";
import { useForm } from "react-hook-form";
import { leadsAPI } from "../services/api";
import { SOURCES } from "../utils/helpers";

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError("");
    try {
      await leadsAPI.submitContact(data);
      setSubmitted(true);
      reset();
    } catch (e) {
      setApiError(e.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="public-page">
        <div className="public-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 20 }}>✅</div>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
            Thanks! We'll be in touch.
          </div>
          <div style={{ color: "var(--text3)", fontSize: 14, marginBottom: 24 }}>
            Your inquiry has been received. Our team will reach out within 24 hours.
          </div>
          <button className="btn btn-secondary" onClick={() => setSubmitted(false)}>
            Submit Another Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="public-page">
      <div className="public-card">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div className="logo-mark">SV</div>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 16 }}>StreamVault</div>
        </div>
        <div className="public-title">Get in Touch</div>
        <div className="public-sub">
          Tell us about your streaming needs and we'll get back to you within 24 hours.
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                className="form-input"
                placeholder="Your full name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <div className="form-error">{errors.name.message}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@company.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
                })}
              />
              {errors.email && <div className="form-error">{errors.email.message}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" placeholder="+91 98765 43210" {...register("phone")} />
            </div>

            <div className="form-group">
              <label className="form-label">Company</label>
              <input className="form-input" placeholder="Your company name" {...register("company")} />
            </div>

            <div className="form-group form-full">
              <label className="form-label">How did you hear about us?</label>
              <select className="form-select" {...register("source")}>
                {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group form-full">
              <label className="form-label">Your Message *</label>
              <textarea
                className="form-textarea"
                placeholder="Describe your project or inquiry in detail…"
                rows={4}
                {...register("message", { required: "Please describe your inquiry" })}
              />
              {errors.message && <div className="form-error">{errors.message.message}</div>}
            </div>

            {apiError && (
              <div className="form-full" style={{ background: "rgba(244,63,94,.1)", border: "1px solid rgba(244,63,94,.25)", borderRadius: "var(--radius)", padding: "10px 14px", fontSize: 13, color: "var(--accent4)" }}>
                {apiError}
              </div>
            )}

            <div className="form-group form-full">
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: 12, fontSize: 14 }}
                disabled={loading}
              >
                {loading ? "Sending…" : "Send Message →"}
              </button>
              <div className="form-hint" style={{ textAlign: "center" }}>
                We respond within 24 hours. No spam, ever.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
