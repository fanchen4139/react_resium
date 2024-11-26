import { memo, useEffect, useState, type CSSProperties, type FC } from "react"
import useCesium from "../../hooks/useCesium"
import { Cartesian3, SceneTransforms, type Cartesian2 } from "cesium"
import type { WithChildren } from "../../types/Common"
import { createPortal } from "react-dom"
import "./container.css";
type DomContainerProps = WithChildren & {
  display?: boolean,
  lng: number,
  lat: number,
  height?: number
}
export const DomContainer: FC<DomContainerProps> = memo(({ children, display = true, lng, lat, height = 10 }) => {
  const { scene } = useCesium()
  const [screenPosition, setScreenPosition] = useState<Cartesian2>(null)

  useEffect(() => {

    // 计算屏幕坐标
    const updateScreenPosition = () => {

      const canvasPosition = SceneTransforms.worldToWindowCoordinates(
        scene,
        Cartesian3.fromDegrees(lng, lat, height)
      );


      setScreenPosition(canvasPosition || null);

      if (!canvasPosition) {
        scene.preRender.removeEventListener(updateScreenPosition);
      }
    };

    scene.preRender.addEventListener(updateScreenPosition);

    // 清理
    return () => {
      scene.preRender.removeEventListener(updateScreenPosition);
    };
  }, [])

  // 不可见时不渲染 DOM
  if (!display || !screenPosition) return null;

  return createPortal(
    <div
      id="dom-container"
      style={{
        '--top': `${screenPosition.y}px`,
        '--left': `${screenPosition.y}px`,
      } as CSSProperties}
    >
      {children}
      <div className="list">
        测试列表
      </div>
    </div>,
    document.body // 渲染到 body
  )
})


type DomContainerByArrayProps = WithChildren & {
  screenPosition: { x: number; y: number } | null;
};

export const DomContainerByArray: FC<DomContainerByArrayProps> = memo(({ children, screenPosition }) => {
  if (!screenPosition) return null;

  return createPortal(
    <div
      id="dom-container"
      style={{
        position: "fixed",
        top: `${screenPosition.y}px`,
        left: `${screenPosition.x}px`,
        transform: "translate(-50%, -50%)",
        pointerEvents: "auto", // 确保交互生效
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: "5px",
        borderRadius: "5px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      {children}
      <div className="list">测试列表</div>
    </div>,
    document.body // 渲染到 body
  );
})
