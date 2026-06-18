import type { AustinFinishOption } from "@/src/lib/view-models/austin";

type FinishSelectorProps = {
  finishes: AustinFinishOption[];
  selectedFinishId: string;
  disabled?: boolean;
  onSelect: (finishId: string) => void;
};

const finishGroups = ["Maple", "Oak"] as const;

export function FinishSelector({
  finishes,
  selectedFinishId,
  disabled = false,
  onSelect
}: FinishSelectorProps) {
  return (
    <section className="builder-step">
      <div className="step-head">
        <div>
          <p className="eyebrow">Step 2</p>
          <h3>Choose finish</h3>
        </div>
        {disabled ? <span className="step-note">Locked for stock package</span> : null}
      </div>
      {finishGroups.map((group) => (
        <div className="finish-group" key={group}>
          <div className="finish-group-head">
            <h4>{group} finishes</h4>
            <span>{group === "Oak" ? "+ $2,000" : "Included"}</span>
          </div>
          <div className="finish-grid">
            {finishes
              .filter((finish) => finish.group === group)
              .map((finish) => (
                <button
                  className={selectedFinishId === finish.id ? "finish-option selected" : "finish-option"}
                  disabled={disabled}
                  key={finish.id}
                  onClick={() => onSelect(finish.id)}
                  type="button"
                >
                  <img alt={`${finish.name} finish swatch`} src={finish.image} />
                  <strong>{finish.name}</strong>
                  <span>{finish.tone}</span>
                </button>
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}
