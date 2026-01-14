import { useEffect, useLayoutEffect } from "react"
import useCesium from "../../hooks/useCesium"
import { Cartesian3, Math as CesiumMath, PerspectiveFrustum, ScreenSpaceEventType, ShadowMode } from "cesium"
import * as Cesium from "cesium";

const Init = () => {

  const viewer = useCesium()

  useEffect(() => {
    // 禁用双击追踪 Entity
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    // 启用抗锯齿
    viewer.scene.postProcessStages.fxaa.enabled = true

    // 初始化视角
    // viewer.camera.flyTo({
    //   destination: Cartesian3.fromDegrees(116.395102, 39.828458, 15000),
    //   orientation: {
    //     heading: Math.toRadians(-1), // 偏航
    //     pitch: Math.toRadians(-60), // 俯仰
    //     // range: 300000 // 高度
    //   },
    //   duration: 0
    // })
    // 假设你已经初始化了 Cesium Viewer
// const viewer = new Cesium.Viewer('cesiumContainer');
// 设置初始相机位置

  const h = 5000; // 初始高度
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(116.385465, 39.75426, h),
  orientation: {
    pitch: Cesium.Math.toRadians(-25), // 俯角 30 度
    heading: Cesium.Math.toRadians(0), // 方向角
    roll: 0.0 // 滚转角
  }
});
// 获取当前相机的俯角
const pitch = viewer.camera.pitch;

// 将弧度转换为角度
const pitchInDegrees = Cesium.Math.toDegrees(pitch);

console.log(`当前相机的俯角是：${pitchInDegrees}度`);


// setTimeout(() => {
// viewer.scene.morphTo2D(0)
//   // 假设物体的位置
//   const objectPosition = Cesium.Cartesian3.fromDegrees(116.385465, 39.901426);
//   // 计算新的高度
//   const pitchAngle = Cesium.Math.toRadians(pitchInDegrees); // 初始俯角
//
//   // Calculate the new height to maintain the same visible range
//   console.log(Math.cos(Cesium.Math.toRadians(60)))
//   console.log(Math.cos(Cesium.Math.toRadians(70)))
//   console.log(Math.cos(Cesium.Math.toRadians(80)))
//   console.log(Math.cos(Cesium.Math.toRadians(90)))
//
//   const hPrime = h * Math.cos(pitchAngle) / Math.cos(Cesium.Math.toRadians(-90 - pitchInDegrees));
//   console.log(hPrime)
//   // 移动相机到物体的正上方
//   viewer.camera.flyTo({
//     destination: Cesium.Cartesian3.fromDegrees(
//       116.385465,
//       39.911426,
//       hPrime
//     ),
//     // orientation: {
//     //   pitch: Cesium.Math.toRadians(-90), // 俯角为 -90 度，直接朝下
//     //   heading: Cesium.Math.toRadians(0), // 方向角
//     //   roll: 0.0 // 滚转角
//     // }
//   });
// }, 3000);
// 切换到 2D 模式
// viewer.scene.morphTo2D(0);

// 等待切换完成
// setTimeout(() => {
//   // 物体的位置
//   const objectPosition = Cesium.Cartesian3.fromDegrees(116.385465, 39.911426);

//   // 移动相机到物体的正上方
//   viewer.camera.flyTo({
//     destination: Cesium.Cartesian3.fromDegrees(
//       116.385465,
//       39.911426,
//       viewer.camera.positionCartographic.height // 保持当前高度
//     ),
//     orientation: {
//       heading: Cesium.Math.toRadians(0), // 方向角
//       pitch: Cesium.Math.toRadians(-90), // 俯角为 -90 度，直接朝下
//       roll: 0.0 // 滚转角
//     }
//   });
// }, 2000); // 等待一段时间以确保切换完成
    //隐藏太阳
    // viewer.scene.globe.enableLighting = false;
    // viewer.scene.globe.shadows = ShadowMode.DISABLED;
    // viewer.shadows = false;
    // viewer.scene.sun.show=false;//还可以viewer.scene.sun.destroy();
    //月亮
    // viewer.scene.moon.show=false;
    //大气
    // viewer.scene.skyAtmosphere.show=false;
    //雾
    // viewer.scene.fog.enabled=false;

  }, [])

  return null
}
export default Init
