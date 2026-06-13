import type { SummaryRow } from "@/src/components/builder/types";

type BuildSummaryProps = {
  rows: SummaryRow[];
  priceLabel: string;
  msrpLabel: string;
  quoteRequired: boolean;
};

export function BuildSummary({ rows, priceLabel, msrpLabel, quoteRequired }: BuildSummaryProps) {
  return (
    <div className="panel build-summary">
      <h3>Your Austin Pool Table at a Glance</h3>
      <div className="build-summary-grid">
        {rows.map((row) => (
          <div key={row.label}>
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </div>
        ))}
      </div>
      <div className="summary-price">
        <span>{quoteRequired ? "Specialist review" : "Current build"}</span>
        <strong>{priceLabel}</strong>
        {!quoteRequired ? <small>MSRP reference: {msrpLabel}</small> : null}
      </div>
    </div>
  );
}
