import React, { useEffect, useRef, useState } from "react";
import { Viewer } from "resium";
import * as Cesium from "cesium";
import ReactDOM from "react-dom";

const FollowPrimitiveWithDOM: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const [screenPosition, setScreenPosition] = useState<Cesium.Cartesian2 | null>(null);
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!viewerRef.current) return;

    const viewer = viewerRef.current;

    // // 创建 Primitive
    // const geometry = Cesium.SphereGeometry.createGeometry(
    //   new Cesium.SphereGeometry({ radius: 50000.0 })
    // );
    // const appearance = new Cesium.MaterialAppearance({
    //   material: Cesium.Material.fromType("Color", {
    //     color: Cesium.Color.BLUE,
    //   }),
    // });

    // const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
    //   Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883, 100000.0) // 地理位置
    // );

    // const primitive = new Cesium.Primitive({
    //   geometryInstances: new Cesium.GeometryInstance({
    //     geometry,
    //     modelMatrix,
    //   }),
    //   appearance,
    // });

    // viewer.scene.primitives.add(primitive);

    // 计算屏幕坐标
    const updateScreenPosition = () => {
      const canvasPosition = Cesium.SceneTransforms.worldToWindowCoordinates(
        viewer.scene,
        Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883, 100000.0)
      );
      setScreenPosition(canvasPosition || null);
      if (!canvasPosition) viewer.scene.preRender.removeEventListener(updateScreenPosition);
    };

    viewer.scene.preRender.addEventListener(updateScreenPosition);

    // 清理
    return () => {
      // viewer.scene.primitives.remove(primitive);
      viewer.scene.preRender.removeEventListener(updateScreenPosition);
    };
  });

  useEffect(() => {
    setTimeout(() => {
      setCount(count + 1)
    }, 100);
  }, [])

  // 渲染 DOM
  return (
    <div>
      <Viewer ref={(ref) => {
        (viewerRef.current = ref?.cesiumElement ?? null)
      }} full>
        {/* Cesium Viewer 渲染 */}
      </Viewer>
      {screenPosition &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "absolute",
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
          </div>,
          document.body // 渲染到 body
        )}
    </div>
  );
};

export default function App() {
  return (
    <FollowPrimitiveWithDOM>
      <div>
        <strong>跟随模型的 DOM</strong>
        <button onClick={() => alert("按钮点击！")}>点击我</button>
      </div>
    </FollowPrimitiveWithDOM>
  );
}
