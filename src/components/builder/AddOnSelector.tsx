import type { AustinAddOnOption } from "@/src/lib/view-models/austin";

type AddOnSelectorProps = {
  addOns: AustinAddOnOption[];
  selectedAddOnIds: string[];
  onToggle: (addOnId: string) => void;
};

export function AddOnSelector({ addOns, selectedAddOnIds, onToggle }: AddOnSelectorProps) {
  return (
    <section className="builder-step">
      <div className="step-head">
        <div>
          <p className="eyebrow">Step 4</p>
          <h3>Finish the table</h3>
        </div>
      </div>
      <div className="addon-grid">
        {addOns.map((item) => (
          <button
            className={selectedAddOnIds.includes(item.id) ? "addon-card selected" : "addon-card"}
            key={item.id}
            onClick={() => onToggle(item.id)}
            type="button"
          >
            <span>{item.badge ?? "Optional"}</span>
            <strong>{item.name}</strong>
            <p>{item.description}</p>
            <em>{item.quoteOnly ? "Quote" : `+ ${item.price.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 })}`}</em>
          </button>
        ))}
      </div>
    </section>
  );
}
