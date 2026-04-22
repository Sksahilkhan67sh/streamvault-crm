import Icon from "../common/Icon";
import { STATUSES } from "../../utils/helpers";

export default function StatusToggles({ current, onChange, loading }) {
  return (
    <div className="status-toggles">
      {STATUSES.map((s) => (
        <button
          key={s}
          className={`status-tog ${s}${current === s ? " active" : ""}`}
          onClick={() => current !== s && onChange(s)}
          disabled={loading || current === s}
        >
          {current === s && <Icon name="check" size={11} style={{ marginRight: 4 }} />}
          {s}
        </button>
      ))}
    </div>
  );
}
