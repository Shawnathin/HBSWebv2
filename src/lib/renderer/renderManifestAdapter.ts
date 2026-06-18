import { mockRendererManifest } from "@/src/data/mockRendererManifest";
import type { RendererManifestViewModel } from "@/src/lib/view-models/renderer";

export type RenderManifestAdapterOptions = {
  source?: "mock" | "asset-host";
};

export async function getAustinRendererManifest(
  options?: RenderManifestAdapterOptions
): Promise<RendererManifestViewModel> {
  if (options?.source === "asset-host") {
    throw new Error(
      "Renderer asset-host manifests are not connected yet. Use the mock manifest until approved URLs exist."
    );
  }

  return mockRendererManifest;
}
