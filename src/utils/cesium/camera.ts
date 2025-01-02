import {
  Viewer,
  Cartesian3,
  Math as CesiumMath,
  BoundingSphere,
  type HeadingPitchRange,
  type Camera,
  type EasingFunction,
  type Matrix4,
} from "cesium";

/**
 * 向上旋转相机，逐步旋转以显示过程，视觉上是向下移动的
 * @param {Viewer} viewer - Cesium Viewer 实例
 * @param {number} angle - 旋转角度（弧度）
 * @param {number} step - 每次旋转的步长（弧度）
 */
export const rotateUp = (
  viewer: Viewer,
  angle: number,
  step: number = CesiumMath.toRadians(0.01)
) => {
  let currentAngle = 0;

  const rotate = () => {
    if (currentAngle < angle) {
      viewer.camera.rotateUp(step);
      currentAngle += step;
      requestAnimationFrame(rotate); // Keep rotating until the angle is reached
    }
  };

  rotate(); // Start rotating
};

/**
 * 向下旋转相机，逐步旋转以显示过程，视觉上是向上移动的
 * @param {Viewer} viewer - Cesium Viewer 实例
 * @param {number} angle - 旋转角度（弧度）
 * @param {number} step - 每次旋转的步长（弧度）
 */
export const rotateDown = (
  viewer: Viewer,
  angle: number,
  step: number = CesiumMath.toRadians(0.01)
) => {
  let currentAngle = 0;

  const rotate = () => {
    console.log("down");
    if (currentAngle < angle) {
      viewer.camera.rotateDown(step);
      currentAngle += step;
      requestAnimationFrame(rotate);
    }
  };

  rotate();
};

/**
 * 向左旋转相机，逐步旋转以显示过程
 * @param {Viewer} viewer - Cesium Viewer 实例
 * @param {number} angle - 旋转角度（弧度）
 * @param {number} step - 每次旋转的步长（弧度）
 */
export const rotateLeft = (
  viewer: Viewer,
  angle: number,
  step: number = CesiumMath.toRadians(0.01)
) => {
  let currentAngle = 0;

  const rotate = () => {
    console.log("left");

    if (currentAngle < angle) {
      viewer.camera.rotateLeft(step);
      currentAngle += step;
      requestAnimationFrame(rotate);
    }
  };

  rotate();
};

/**
 * 向右旋转相机，逐步旋转以显示过程
 * @param {Viewer} viewer - Cesium Viewer 实例
 * @param {number} angle - 旋转角度（弧度）
 * @param {number} step - 每次旋转的步长（弧度）
 */
export const rotateRight = (
  viewer: Viewer,
  angle: number,
  step: number = CesiumMath.toRadians(0.01)
) => {
  let currentAngle = 0;

  const rotate = () => {
    console.log("right");
    if (currentAngle < angle) {
      viewer.camera.rotateRight(step);
      currentAngle += step;
      requestAnimationFrame(rotate);
    }
  };

  rotate();
};

/**
 * 放大相机视角
 * @param {Viewer} viewer - Cesium Viewer 实例
 * @param {number} amount - 放大量
 */
export const zoomIn = (viewer: Viewer, amount: number) => {
  viewer.camera.zoomIn(amount);
};

/**
 * 缩小相机视角
 * @param {Viewer} viewer - Cesium Viewer 实例
 * @param {number} amount - 缩小量
 */
export const zoomOut = (viewer: Viewer, amount: number) => {
  viewer.camera.zoomOut(amount);
};

/**
 * 飞到指定位置
 * @param {Viewer} viewer - Cesium Viewer 实例
 * @param {number} longitude - 目标经度
 * @param {number} latitude - 目标纬度
 * @param {number} height - 目标高度
 * @param {number} heading - 偏航角（度）
 * @param {number} pitch - 俯仰角（度）
 * @param {number} duration - 飞行持续时间（秒）
 */
export const flyTo = (
  viewer: Viewer,
  longitude: number,
  latitude: number,
  height: number,
  heading: number,
  pitch: number,
  duration: number = 30
) => {
  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(longitude, latitude, height),
    orientation: {
      heading: CesiumMath.toRadians(heading),
      pitch: CesiumMath.toRadians(pitch),
    },
    duration: duration,
  });
};

/**
 * 飞到由经度、纬度和半径定义的包围球。
 *
 * @param {Viewer} viewer - Cesium Viewer 实例。
 * @param {number} longitude - 包围球中心的经度（度）。
 * @param {number} latitude - 包围球中心的纬度（度）。
 * @param {number} radius - 包围球的半径（米）。
 * @param {Object} options - 包含飞行附加选项的对象。
 * @param {number} [options.duration=3] - 飞行持续时间（秒），默认是3秒。
 * @param {HeadingPitchRange} [options.offset] - 从目标的本地东-北-上参考系的偏移量。
 * @param {Camera.FlightCompleteCallback} [options.complete] - 飞行完成时调用的回调函数。
 * @param {Camera.FlightCancelledCallback} [options.cancel] - 飞行取消时调用的回调函数。
 * @param {Matrix4} [options.endTransform] - 表示结束参考系的变换矩阵。
 * @param {number} [options.maximumHeight] - 飞行最高点的最大高度。
 * @param {number} [options.pitchAdjustHeight] - 调整俯仰角的高度。
 * @param {number} [options.flyOverLongitude] - 飞行过程中飞越的经度。
 * @param {number} [options.flyOverLongitudeWeight] - 飞越经度的权重。
 * @param {EasingFunction.Callback} [options.easingFunction] - 用于飞行的缓动函数。
 */
export const flyToBoundingSphere = (
  viewer: Viewer,
  longitude: number,
  latitude: number,
  radius: number,
  options?: {
    duration?: number;
    offset?: HeadingPitchRange;
    complete?: Camera.FlightCompleteCallback;
    cancel?: Camera.FlightCancelledCallback;
    endTransform?: Matrix4;
    maximumHeight?: number;
    pitchAdjustHeight?: number;
    flyOverLongitude?: number;
    flyOverLongitudeWeight?: number;
    easingFunction?: EasingFunction.Callback;
  }
) => {
  const boundingSphere = new BoundingSphere(
    Cartesian3.fromDegrees(longitude, latitude),
    radius
  );
  viewer.camera.flyToBoundingSphere(
    boundingSphere,
    (options = {
      duration: 3,
    })
  );
};
