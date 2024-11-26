import { memo, type FC } from "react"
import { createPortal } from "react-dom"
import type { WithChildren } from "../../../types/Common"
import "./container.css"


type DomContainerByArrayProps = WithChildren & {
  screenPosition: { x: number; y: number } | null;
};

export const DomContainerByArray: FC<DomContainerByArrayProps> = ({ children, screenPosition }) => {
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
}

export default memo(DomContainerByArray)