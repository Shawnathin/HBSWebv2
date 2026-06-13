import type { AustinBuildMode, AustinFinishOption, AustinSizeOption, AustinStockPackage } from "@/src/lib/view-models/austin";

type PathPickerProps = {
  mode: AustinBuildMode;
  stockPackage: AustinStockPackage;
  stockSize: AustinSizeOption;
  stockFinish: AustinFinishOption;
  onModeChange: (mode: AustinBuildMode) => void;
};

export function PathPicker({ mode, stockPackage, stockSize, stockFinish, onModeChange }: PathPickerProps) {
  return (
    <div className="path-picker">
      <button
        className={mode === "stock" ? "path-card active" : "path-card"}
        onClick={() => onModeChange("stock")}
        type="button"
      >
        <p className="eyebrow">In-stock option</p>
        <h3>{stockPackage.name}</h3>
        <p>{stockPackage.subtitle}</p>
        <ul>
          <li>
            <strong>Size:</strong> {stockSize.name}
          </li>
          <li>
            <strong>Finish:</strong> {stockFinish.name}
          </li>
          <li>
            <strong>Next:</strong> choose cloth and add-ons
          </li>
        </ul>
      </button>
      <button
        className={mode === "custom" ? "path-card active" : "path-card"}
        onClick={() => onModeChange("custom")}
        type="button"
      >
        <p className="eyebrow">Custom build</p>
        <h3>Build around the room</h3>
        <p>August Install Estimated. Choose the size, wood finish, cloth, and table additions.</p>
      </button>
    </div>
  );
}
