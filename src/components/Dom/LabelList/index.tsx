import { Cartesian3, SceneTransforms, Math } from "cesium";
import useCesium from "../../../hooks/useCesium";
import { DomContainerByArray } from "../Container";
import { useCallback, useEffect, useState } from "react";

const LabelList = () => {
  const viewer = useCesium()
  // 创建模拟节点
  const [positions, setPositions] = useState<
    { lng: number; lat: number; screenPosition: { x: number; y: number } | null }[]
  >([]);

  useEffect(() => {
    const points = Array.from({ length: 10 }).map((_, index) => ({
      lng: 116.398312 + index * 0.003,
      lat: 39.907038,
    }));

    const updatePositions = () => {
      const updatedPositions = points.map((point) => {
        const cartesian = Cartesian3.fromDegrees(point.lng, point.lat, 10);
        const screenPosition = SceneTransforms.worldToWindowCoordinates(viewer.scene, cartesian);
        return {
          ...point,
          screenPosition: screenPosition
            ? { x: screenPosition.x, y: screenPosition.y }
            : null,
        };
      });
      setPositions(updatedPositions);
    };

    viewer.scene.preRender.addEventListener(updatePositions);

    return () => {
      viewer.scene.preRender.removeEventListener(updatePositions);
    };
  }, [viewer]);

  const { camera } = useCesium()

  const handleClick = useCallback(() => {
    camera.flyTo({
      destination: Cartesian3.fromDegrees(116.395102, 39.868458, 8000),
      orientation: {
        heading: Math.toRadians(-1), // 偏航
        pitch: Math.toRadians(-60), // 俯仰
        range: 3000 // 高度
      },
      duration: 0
    })
  }, [])

  return (
    <>
      {
        positions.map((point, index) => (
          <DomContainerByArray key={index} screenPosition={point.screenPosition}>
            <div onClick={handleClick}>测试面板</div>
          </DomContainerByArray>
        ))
      }
    </>
  )
}

export default LabelList