import { Cartesian3, SceneTransforms, type Cartesian2 } from "cesium"
import { memo, useEffect, useState, type CSSProperties, type FC } from "react"
import { createPortal } from "react-dom"
import useCesium from "../../../hooks/useCesium"
import type { WithChildren } from "../../../types/Common"
import "./container.css"

type DomContainerProps = WithChildren & {
  display?: boolean,
  lng: number,
  lat: number,
  height?: number
}

const DomContainer: FC<DomContainerProps> = ({ children, display = true, lng, lat, height = 10 }) => {
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
}

export default memo(DomContainer)