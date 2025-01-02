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
export function setPosition(tileset, lng, lat, h) {
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
export function serMatrix(tileset, matrix) {
  tileset.modelMatrix = matrix || Cesium.Matrix4.IDENTITY;
}

export function transform(
  tileset,
  degrees: { lng: number; lat: number; height?: number },
  rotate: { x?: number; y?: number; z?: number } = {},
  scale: number | { x?: number; y?: number; z?: number } = 1
) {
  // 经度、纬度、高度
  const { lng, lat, height = 0 } = degrees;

  // tileset 球模型中心点
  const { longitude, latitude } = Cesium.Cartographic.fromCartesian(
    tileset.boundingSphere.center
  );

  //平移
  const position = Cesium.Cartesian3.fromDegrees(
    lng ?? longitude,
    lat ?? latitude,
    height
  );
  const translation = Cesium.Transforms.eastNorthUpToFixedFrame(position);

  //旋转
  const { x: rotateX = 0, y: rotateY = 0, z: rotateZ = 0 } = rotate;
  const mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(rotateX));
  const my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(rotateY));
  const mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rotateZ));
  const rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
  const rotationY = Cesium.Matrix4.fromRotationTranslation(my);
  const rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);

  // 缩放
  let scaleX, scaleY, scaleZ;
  if (typeof scale === "number") {
    scaleX = scaleY = scaleZ = scale;
  } else {
    const { x = 1, y = 1, z = 1 } = scale;
    scaleX = x;
    scaleY = y;
    scaleZ = z;
  }
  const scaleMatrix = Cesium.Matrix4.fromScale(
    new Cesium.Cartesian3(scaleX, scaleY, scaleZ)
  );

  //旋转、平移矩阵相乘
  Cesium.Matrix4.multiply(translation, rotationX, translation);
  Cesium.Matrix4.multiply(translation, rotationY, translation);
  Cesium.Matrix4.multiply(translation, rotationZ, translation);
  Cesium.Matrix4.multiply(translation, scaleMatrix, translation);
  //赋值给tileset
  tileset._root.transform = translation;
}

//控制3dTiles的抬高
export function raiseCesium3DTileset(tileset, height) {
  //得到当前模型矩阵经过变换后的位置
  const matrix = Cesium.Matrix4.multiply(
    tileset.modelMatrix, //表示在初始位置上做了什么变换（即所有的变换）
    tileset.root.transform, //规定了初始位置在哪里
    new Cesium.Matrix4()
  );

  //平移的部分
  const translation = Cesium.Matrix4.getTranslation(
    matrix,
    new Cesium.Cartesian3()
  );
  //转为地理坐标
  const cartographic = Cesium.Cartographic.fromCartesian(translation);
  //根据当前模型平移的位置，改变其高度
  const newTranslation = Cesium.Cartesian3.fromRadians(
    cartographic.longitude,
    cartographic.latitude,
    cartographic.height + height
  );
  //设置平移矩阵变换
  Cesium.Matrix4.setTranslation(matrix, newTranslation, matrix);
  const inverse = Cesium.Matrix4.inverse(
    tileset.root.transform,
    new Cesium.Matrix4()
  );

  tileset.modelMatrix = Cesium.Matrix4.multiply(
    matrix,
    inverse,
    new Cesium.Matrix4()
  );
}
