import type { AustinClothOption } from "@/src/lib/view-models/austin";

type ClothSelectorProps = {
  cloths: AustinClothOption[];
  selectedClothId: string;
  onSelect: (clothId: string) => void;
};

const clothFamilies = ["Championship Invitational", "Championship Tour Edition"] as const;

export function ClothSelector({ cloths, selectedClothId, onSelect }: ClothSelectorProps) {
  return (
    <section className="builder-step">
      <div className="step-head">
        <div>
          <p className="eyebrow">Step 3</p>
          <h3>Choose cloth</h3>
        </div>
      </div>
      {clothFamilies.map((family) => (
        <div className="cloth-section" key={family}>
          <div className="cloth-section-head">
            <div>
              <h4>{family}</h4>
              <p>
                {family === "Championship Tour Edition"
                  ? "Worsted tournament-grade cloth for faster, more accurate play."
                  : "North America's most popular home-grade cloth."}
              </p>
            </div>
            <span>{family === "Championship Tour Edition" ? "+ $249" : "Included"}</span>
          </div>
          <div className="cloth-grid">
            {cloths
              .filter((cloth) => cloth.family === family)
              .map((cloth) => (
                <button
                  className={selectedClothId === cloth.id ? "cloth-option selected" : "cloth-option"}
                  key={cloth.id}
                  onClick={() => onSelect(cloth.id)}
                  type="button"
                >
                  <span aria-hidden="true" className="cloth-dot" style={{ backgroundColor: cloth.hex }} />
                  <strong>{cloth.name}</strong>
                </button>
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}
