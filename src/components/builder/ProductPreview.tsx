import type { CSSProperties } from "react";

import type { AustinClothOption, AustinFinishOption, AustinGalleryImage } from "@/src/lib/view-models/austin";
import type { RendererManifestViewModel } from "@/src/lib/view-models/renderer";

type ProductPreviewProps = {
  activeGalleryId: string;
  galleryImages: AustinGalleryImage[];
  selectedCloth: AustinClothOption;
  selectedFinish: AustinFinishOption;
  rendererManifest: RendererManifestViewModel;
  onGalleryChange: (galleryId: string) => void;
};

export function ProductPreview({
  activeGalleryId,
  galleryImages,
  selectedCloth,
  selectedFinish,
  rendererManifest,
  onGalleryChange
}: ProductPreviewProps) {
  const activeGallery = galleryImages.find((image) => image.id === activeGalleryId) ?? galleryImages[0];
  const rendererView =
    rendererManifest.views[rendererManifest.defaultViewSlug] ??
    Object.values(rendererManifest.views)[0];
  const finishKey = `${selectedFinish.group.toLowerCase()}|${selectedFinish.id}`;
  const finishOverlay =
    rendererView?.finishOverlays[finishKey] ?? rendererManifest.fallbacks.missingFinishOverlayUrl;
  const showBuild = activeGallery.id === "build";

  return (
    <div className="preview-card">
      <div aria-label="Product gallery thumbnails" className="gallery-rail">
        {galleryImages.map((image) => (
          <button
            aria-label={image.label}
            className={activeGallery.id === image.id ? "gallery-thumb active" : "gallery-thumb"}
            key={image.id}
            onClick={() => onGalleryChange(image.id)}
            type="button"
          >
            <span>{image.label}</span>
          </button>
        ))}
      </div>
      <div className="preview-stage">
        <div aria-hidden="true" className="media-badges">
          <span>In stock</span>
          <span>Ready for Install</span>
        </div>
        {showBuild ? (
          <div
            className="product-media-frame renderer-frame"
            style={
              {
                "--cloth-color": selectedCloth.hex,
                "--cloth-mask": `url(${rendererView?.clothMaskUrl ?? ""})`
              } as CSSProperties
            }
          >
            <div aria-hidden="true" className="cloth-layer" />
            {rendererView?.clothShadowMapUrl ? (
              <img alt="" aria-hidden="true" className="cloth-shadow" src={rendererView.clothShadowMapUrl} />
            ) : null}
            <img
              alt={`California House Austin pool table in ${selectedFinish.name} finish`}
              className="pool-photo finish-overlay"
              src={finishOverlay}
            />
          </div>
        ) : (
          <div className="product-media-frame gallery-frame">
            <img alt={activeGallery.alt} className="pool-photo gallery-photo" src={activeGallery.src} />
          </div>
        )}
      </div>
    </div>
  );
}
