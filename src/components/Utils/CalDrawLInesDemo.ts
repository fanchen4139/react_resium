import * as Cesium from "cesium";

/**
 * @description: 距离测量
 * @param: drawingMode参数为"line"或者"polygon"，当为"line"时，标记路径为线条；当为"polygon"时，标记路径为多边形
 */

export function calDrawLinesDemo(viewer: Cesium.Viewer, drawingMode) {
  let activeShapePoints = [];
  let activeShape;
  let floatingPoint;

  viewer.screenSpaceEventHandler.setInputAction(function (event) {
    // We use `viewer.scene.globe.pick here instead of `viewer.camera.pickEllipsoid` so that
    // we get the correct point when mousing over terrain.
    const ray = viewer.camera.getPickRay(event.position);
    const earthPosition = viewer.scene.globe.pick(ray, viewer.scene);
    if (Cesium.defined(earthPosition)) {
      if (activeShapePoints.length === 0) {
        floatingPoint = createPoint(earthPosition, activeShapePoints);
        activeShapePoints.push(earthPosition);
        const dynamicPositions = new Cesium.CallbackProperty(function () {
          if (drawingMode === "polygon") {
            return new Cesium.PolygonHierarchy(activeShapePoints);
          }
          return activeShapePoints;
        }, false);
        activeShape = drawShape(dynamicPositions, drawingMode);
      }
      activeShapePoints.push(earthPosition);
      createPoint(earthPosition, activeShapePoints);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  viewer.screenSpaceEventHandler.setInputAction(function (event) {
    if (Cesium.defined(floatingPoint)) {
      const ray = viewer.camera.getPickRay(event.endPosition);
      const newPosition = viewer.scene.globe.pick(ray, viewer.scene);
      if (Cesium.defined(newPosition)) {
        floatingPoint.position.setValue(newPosition);
        activeShapePoints.pop();
        activeShapePoints.push(newPosition);
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
  );

  // 鼠标右击移除
  viewer.screenSpaceEventHandler.setInputAction(function (event) {
    terminateShape();
    viewer.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

  function terminateShape() {
    activeShapePoints.pop();
    // drawShape(activeShapePoints, drawingMode);
    viewer.entities.remove(floatingPoint);
    // viewer.entities.remove(activeShape);
    floatingPoint = undefined;
    activeShape = undefined;
    // activeShapePoints = [];
  }

  function createPoint(worldPosition, activeShapePoints) {
    var distance = calDistance(activeShapePoints);
    const point = viewer.entities.add({
      position: worldPosition,
      point: {
        color: Cesium.Color.GREEN,
        pixelSize: 10,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: distance + "米",
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -10),
        font: "20px monospace",
        showBackground: true,
        backgroundColor: Cesium.Color.BLACK.withAlpha(1),
        backgroundPadding: new Cesium.Cartesian2(17, 10),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
    return point;
  }

  function drawShape(positionData, drawingMode) {
    let shape;
    if (drawingMode === "line") {
      shape = viewer.entities.add({
        polyline: {
          positions: positionData,
          clampToGround: false,
          width: 5,
          material: Cesium.Color.RED,
        },
      });
    } else if (drawingMode === "polygon") {
      shape = viewer.entities.add({
        polygon: {
          hierarchy: positionData,
          material: new Cesium.ColorMaterialProperty(
            Cesium.Color.GREEN.withAlpha(1)
          ),
        },
      });
    }
    return shape;
  }

  function calDistance(positions) {
    var distance = 0;
    for (var i = 0; i < positions.length - 1; i++) {
      distance += Cesium.Cartesian3.distance(positions[i], positions[i + 1]);
    }
    return distance.toFixed(2);
  }
}
