import type { Viewer } from "cesium";
import { create } from "zustand";

type Viewertype = { cesiumElement: Viewer } | null;

type ViewerStoreState = {
  viewer: Viewertype;
};
type ViewerStoreActions = {
  setViewer: (viewer: { cesiumElement: Viewer }) => void;
  getViewer: () => Viewer | undefined;
};
type ViewerStore = ViewerStoreState & ViewerStoreActions;

const useViewerStore = create<ViewerStore>()((set, get) => ({
  viewer: null,
  setViewer: (viewer) => set({ viewer }),
  getViewer: () => get().viewer?.cesiumElement,
}));

export default useViewerStore;
