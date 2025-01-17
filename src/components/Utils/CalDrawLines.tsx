import useCesium from "@/hooks/useCesium"
import { CallbackProperty, defined, PolygonHierarchy, ScreenSpaceEventType } from "cesium"
import { memo } from "react"
import { Entity } from "resium"

export enum DrawingMode {
  Line,
  Polygon
}

const CalDrawLines = ({ viewer, drawingMode }) => {
  viewer = useCesium()
  const activeShapePoints = []
  let activeShape, floatingPoint

  // 鼠标左键点击事件
  viewer.screenSpaceEventHandler.setInputAction(function (event) {
    // 我们在这里使用 `viewer.scene.globe.pick` 而不是 `viewer.camera.pickEllipsoid`，
    // 这样在鼠标悬停在地形上时可以获得正确的点。
    const ray = viewer.camera.getPickRay(event.position);
    const earthPosition = viewer.scene.globe.pick(ray, viewer.scene);
    if (defined(earthPosition)) {
      if (activeShapePoints.length === 0) {
        floatingPoint = createPoint(earthPosition, activeShapePoints);
        activeShapePoints.push(earthPosition);
        const dynamicPositions = new CallbackProperty(function () {
          if (drawingMode === "polygon") {
            return new PolygonHierarchy(activeShapePoints);
          }
          return activeShapePoints;
        }, false);
        activeShape = drawShape(dynamicPositions, drawingMode);
      }
      activeShapePoints.push(earthPosition);
      createPoint(earthPosition, activeShapePoints);
    }
  }, ScreenSpaceEventType.LEFT_CLICK);

  if (drawingMode === DrawingMode.Line) {
    return (
      <Entity>
      </Entity>
    )
  } else {
    return (
      <>
      </>
    )
  }
}

export default memo(CalDrawLines)

function createPoint(earthPosition: any, activeShapePoints: any[]): any {
  throw new Error("Function not implemented.")
}
function drawShape(dynamicPositions: CallbackProperty, drawingMode: any): any {
  throw new Error("Function not implemented.")
}

