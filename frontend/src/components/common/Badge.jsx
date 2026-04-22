import { cap } from "../../utils/helpers";
export default function Badge({ status, type = "status" }) {
  if (type === "source") return <span className="badge badge-source">{status}</span>;
  return <span className={`badge badge-${status}`}>{cap(status)}</span>;
}
