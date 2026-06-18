import type { AustinSizeOption } from "@/src/lib/view-models/austin";

type SizeSelectorProps = {
  sizes: AustinSizeOption[];
  selectedSizeId: string;
  disabled?: boolean;
  onSelect: (sizeId: string) => void;
};

export function SizeSelector({ sizes, selectedSizeId, disabled = false, onSelect }: SizeSelectorProps) {
  return (
    <section className="builder-step">
      <div className="step-head">
        <div>
          <p className="eyebrow">Step 1</p>
          <h3>Choose table size</h3>
        </div>
        {disabled ? <span className="step-note">Locked for stock package</span> : null}
      </div>
      <div className="option-grid">
        {sizes.map((size) => (
          <button
            className={selectedSizeId === size.id ? "option-card selected" : "option-card"}
            disabled={disabled}
            key={size.id}
            onClick={() => onSelect(size.id)}
            type="button"
          >
            <span>{size.subtitle}</span>
            <strong>{size.name}</strong>
            <p>{size.recommendedRoom}</p>
            <small>{size.playFeel}</small>
            <em>{size.quoteOnly ? "Quote required" : `From ${size.basePrice.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 })}`}</em>
          </button>
        ))}
      </div>
    </section>
  );
}
