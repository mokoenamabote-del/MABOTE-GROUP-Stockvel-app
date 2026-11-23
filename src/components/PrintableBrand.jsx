import "./PrintableBrand.css";

export default function PrintableBrand({ title, subtitle, compact = false, className = "" }) {
  return (
    <header className={`printable-brand ${compact ? "printable-brand--compact" : ""} ${className}`}>
      <img src="/mabote-logo.svg" alt="MABOTE GROUP PTY(LTD)" />
      {(title || subtitle) && (
        <div className="printable-brand-copy">
          {title && <h2>{title}</h2>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}
    </header>
  );
}
