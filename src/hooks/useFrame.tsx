import type { Viewer } from "cesium";
import { useContext, useEffect } from "react";
import { CesiumContext } from "resium";
import useCesium from "./useCesium";

// 声明回调类型
type CallBack = (state: Viewer) => void;

export function useFrame(callback: CallBack) {
  const { viewer } = useCesium()
  useEffect(() => {
    function tick() {
      callback(viewer);
    }
    viewer.clock.onTick.addEventListener(tick);

    return () => {
      viewer.clock.onTick.removeEventListener(tick);
    };
  }, []);
  return null;
}
