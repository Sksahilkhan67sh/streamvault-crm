export default function Spinner({ fullscreen, size = "sm" }) {
  const cls = size === "lg" ? "spinner spinner-lg" : "spinner";
  if (fullscreen) {
    return (
      <div className="spinner-page">
        <div className="spinner spinner-lg" />
      </div>
    );
  }
  return <div className={cls} />;
}
