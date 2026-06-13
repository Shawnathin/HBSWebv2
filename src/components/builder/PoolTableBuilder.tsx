"use client";

import { useMemo, useState } from "react";

import { AddOnSelector } from "@/src/components/builder/AddOnSelector";
import { BuildSummary } from "@/src/components/builder/BuildSummary";
import { ClothSelector } from "@/src/components/builder/ClothSelector";
import { FinishSelector } from "@/src/components/builder/FinishSelector";
import { PathPicker } from "@/src/components/builder/PathPicker";
import { ProductPreview } from "@/src/components/builder/ProductPreview";
import { QuoteModal } from "@/src/components/builder/QuoteModal";
import { SizeSelector } from "@/src/components/builder/SizeSelector";
import type { SummaryRow } from "@/src/components/builder/types";
import type { AustinBuildMode, AustinProductViewModel } from "@/src/lib/view-models/austin";
import type { RendererManifestViewModel } from "@/src/lib/view-models/renderer";

type PoolTableBuilderProps = {
  product: AustinProductViewModel;
  rendererManifest: RendererManifestViewModel;
};

const money = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0
});

export function PoolTableBuilder({ product, rendererManifest }: PoolTableBuilderProps) {
  const stockPackage = product.stockPackages[0];
  const [mode, setMode] = useState<AustinBuildMode>(product.defaultBuild.mode);
  const [selectedSizeId, setSelectedSizeId] = useState(product.defaultBuild.selectedSizeSlug);
  const [selectedFinishId, setSelectedFinishId] = useState(product.defaultBuild.selectedFinishSlug);
  const [selectedClothId, setSelectedClothId] = useState(product.defaultBuild.selectedClothSlug);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>(product.defaultBuild.selectedAddOnSlugs);
  const [activeGalleryId, setActiveGalleryId] = useState(product.galleryImages[0]?.id ?? "build");
  const [modalIntent, setModalIntent] = useState<"quote" | "cart" | null>(null);

  const stockSize = product.sizes.find((size) => size.id === stockPackage.sizeId) ?? product.sizes[0];
  const stockFinish =
    product.finishes.find((finish) => finish.id === stockPackage.finishId) ?? product.finishes[0];

  const selectedSize = product.sizes.find((size) => size.id === selectedSizeId) ?? stockSize;
  const selectedFinish =
    product.finishes.find((finish) => finish.id === selectedFinishId) ?? stockFinish;
  const selectedCloth = product.cloths.find((cloth) => cloth.id === selectedClothId) ?? product.cloths[0];
  const selectedAddOns = product.addOns.filter((item) => selectedAddOnIds.includes(item.id));

  const subtotal = selectedSize.quoteOnly
    ? 0
    : selectedSize.basePrice +
      selectedFinish.upcharge +
      selectedCloth.upcharge +
      selectedAddOns.reduce((sum, item) => sum + (item.quoteOnly ? 0 : item.price), 0);
  const msrp = selectedSize.quoteOnly
    ? 0
    : selectedSize.msrp +
      selectedFinish.msrpUpcharge +
      selectedCloth.msrpUpcharge +
      selectedAddOns.reduce((sum, item) => sum + (item.quoteOnly ? 0 : item.msrp), 0);
  const quoteRequired = Boolean(selectedSize.quoteOnly || selectedAddOns.some((item) => item.quoteOnly));
  const priceLabel = quoteRequired ? "Quote required" : money.format(subtotal);
  const msrpLabel = money.format(msrp);

  const summaryRows = useMemo<SummaryRow[]>(
    () => [
      { label: "Path", value: mode === "stock" ? stockPackage.subtitle : "Custom build" },
      { label: "Size", value: selectedSize.name },
      { label: "Finish", value: `${selectedFinish.name} - ${selectedFinish.group}` },
      { label: "Cloth", value: `${selectedCloth.name} - ${selectedCloth.family}` },
      {
        label: "Add-ons",
        value: selectedAddOns.length ? selectedAddOns.map((item) => item.name).join(", ") : "None selected"
      },
      {
        label: "ETA",
        value: mode === "stock" ? "Ready for Install" : "Made for you: August Install Estimated"
      }
    ],
    [mode, selectedAddOns, selectedCloth, selectedFinish, selectedSize, stockPackage.subtitle]
  );

  function handleModeChange(nextMode: AustinBuildMode) {
    setMode(nextMode);
    setActiveGalleryId("build");

    if (nextMode === "stock") {
      setSelectedSizeId(stockPackage.sizeId);
      setSelectedFinishId(stockPackage.finishId);
    }
  }

  function toggleAddOn(addOnId: string) {
    setSelectedAddOnIds((current) =>
      current.includes(addOnId) ? current.filter((item) => item !== addOnId) : [...current, addOnId]
    );
  }

  return (
    <>
      <main className="builder-page">
        <aside className="preview-column">
          <ProductPreview
            activeGalleryId={activeGalleryId}
            galleryImages={product.galleryImages}
            onGalleryChange={setActiveGalleryId}
            rendererManifest={rendererManifest}
            selectedCloth={selectedCloth}
            selectedFinish={selectedFinish}
          />
          <BuildSummary
            msrpLabel={msrpLabel}
            priceLabel={priceLabel}
            quoteRequired={quoteRequired}
            rows={summaryRows}
          />
        </aside>

        <section className="config-column">
          <div className="panel product-panel">
            <div className="intro">
              <div className="intro-copy">
                <p className="eyebrow">{product.brand}</p>
                <h1>{product.name}</h1>
                <p className="product-description">{product.description}</p>
              </div>
              <div className="intro-badges">
                {product.badges.map((badge) => (
                  <span className="badge dark" key={badge}>
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <PathPicker
              mode={mode}
              onModeChange={handleModeChange}
              stockFinish={stockFinish}
              stockPackage={stockPackage}
              stockSize={stockSize}
            />
            <SizeSelector
              disabled={mode === "stock"}
              onSelect={setSelectedSizeId}
              selectedSizeId={selectedSize.id}
              sizes={product.sizes}
            />
            <FinishSelector
              disabled={mode === "stock"}
              finishes={product.finishes}
              onSelect={setSelectedFinishId}
              selectedFinishId={selectedFinish.id}
            />
            <ClothSelector cloths={product.cloths} onSelect={setSelectedClothId} selectedClothId={selectedCloth.id} />
            <AddOnSelector addOns={product.addOns} onToggle={toggleAddOn} selectedAddOnIds={selectedAddOnIds} />

            <div className="purchase-panel">
              <div className="included-box">
                <div>
                  <h3>Installation and play package included</h3>
                  <ul className="included-list">
                    {product.includedItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="purchase-actions">
                <div className="price-wrap">
                  <p className="big-price">{priceLabel}</p>
                  {!quoteRequired ? <p className="muted">MSRP reference: {msrpLabel}</p> : null}
                </div>
                <div className="footer-actions">
                  <button className="btn" onClick={() => setModalIntent("quote")} type="button">
                    Request a Quote
                  </button>
                  <button className="btn primary" onClick={() => setModalIntent("cart")} type="button">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <QuoteModal
        intent={modalIntent ?? "quote"}
        isOpen={modalIntent !== null}
        onClose={() => setModalIntent(null)}
        quoteRequired={quoteRequired}
        rows={summaryRows}
      />
    </>
  );
}
