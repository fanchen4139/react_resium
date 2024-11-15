/*
 * @Date: 2023-06-28 19:35:03
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-30 09:43:16
 * @FilePath: \cesium-tyro-blog\src\utils\ThreeDTiles\translateTileset.js
 * @Description: 平移（Translation）：将Tileset在三维场景中沿着指定的方向平移
 *
 * import {setPosition} from '@/utils/ThreeDTiles/translateTileset.js'
 * setPosition(tileset, 113.27, 23.13, 10)
 */

import * as Cesium from "cesium";
import { title } from "process";

/**
 * Sets the position of the tileset to the specified coordinates.
 *
 * @param {Object} tileset - The tileset to set the position for.
 * @param {Number} lng - The longitude of the new position in degrees. Defaults to the current tileset's longitude.
 * @param {Number} lat - The latitude of the new position in degrees. Defaults to the current tileset's latitude.
 * @param {Number} h - The height of the new position in meters. Defaults to the current tileset's height.
 * @return {undefined} This function does not return a value.
 */
function setPosition(tileset, lng, lat, h) {
  // 计算出模型包围球的中心点(弧度制)，从世界坐标转弧度制
  const cartographic = Cesium.Cartographic.fromCartesian(
    tileset.boundingSphere.center
  );
  const { longitude, latitude, height } = cartographic;

  // 模型包围球的中心点坐标，输出以笛卡尔坐标系表示的三维坐标点
  const current = Cesium.Cartesian3.fromRadians(longitude, latitude, height);

  // 新的位置的中心点坐标，输出以笛卡尔坐标系表示的三维坐标点
  const offset = Cesium.Cartesian3.fromDegrees(
    lng || Cesium.Math.toDegrees(longitude),
    lat || Cesium.Math.toDegrees(latitude),
    h || height
  );

  // 计算差向量：计算tileset的平移量，并将其应用到modelMatrix中
  const translation = Cesium.Cartesian3.subtract(
    offset,
    current,
    new Cesium.Cartesian3()
  );

  // 修改模型的变换矩阵，通过四维矩阵
  tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
}

/**
 * Resets the position of a tileset to a specified model matrix or the identity matrix if none is provided.
 *
 * @param {Tileset} tileset - The tileset to reset the position of.
 * @param {Matrix4} modelMatrix - Optional. The model matrix to set the tileset's position to. If not provided, the identity matrix（单位向量） will be used.
 */
function serMatrix(tileset, matrix) {
  tileset.modelMatrix = matrix || Cesium.Matrix4.IDENTITY;
}

function transform(
  tileset,
  { lon, lat, height = 0, rotateX = 0, rotateY = 0, rotateZ = 0 }
) {
  const { longitude, latitude } = Cesium.Cartographic.fromCartesian(
    tileset.boundingSphere.center
  );

  //旋转
  const mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(rotateX));
  const my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(rotateY));
  const mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rotateZ));
  const rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
  const rotationY = Cesium.Matrix4.fromRotationTranslation(my);
  const rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
  //平移
  const position = Cesium.Cartesian3.fromDegrees(
    lon ?? longitude,
    lat ?? latitude,
    height
  );
  const m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
  //旋转、平移矩阵相乘
  Cesium.Matrix4.multiply(m, rotationX, m);
  Cesium.Matrix4.multiply(m, rotationY, m);
  Cesium.Matrix4.multiply(m, rotationZ, m);
  //赋值给tileset
  tileset._root.transform = m;
}

export { setPosition, serMatrix, transform };
