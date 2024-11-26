import type { Camera, Cartesian2 } from "cesium";
import * as Cesium from "cesium";

/**
 * 将平面坐标 Cartesian2 转换成 经纬度坐标
 * @param Cartesian2 [position] - 平面坐标
 * @param Camera [camera] - Cesium.Camera 的实例引用
 * @returns 坐标对象
 */
export default function getCoordinateByPosition(
  position: Cartesian2,
  camera: Camera
): {
  longitude: number;
  latitude: number;
  altitude: number;
} {
  const cartesian = camera.pickEllipsoid(position);
  const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
  const lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
  const lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
  const alt = cartographic.height; // 高度，椭球面height永远等于0
  const coordinate = {
    longitude: Number(lng.toFixed(6)),
    latitude: Number(lat.toFixed(6)),
    altitude: Number(alt.toFixed(2)),
  };
  return coordinate;
}
