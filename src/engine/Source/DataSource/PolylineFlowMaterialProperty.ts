import {
  Color,
  Event,
  Property,
  Material,
  Cartesian2,
  defined,
  // @ts-ignore
  createPropertyDescriptor,
  JulianDate,
} from "cesium";

/**
 * defaultValue 工具函数：如果 value 为 undefined 或 null，返回 defaultValue
 * Cesium 内部使用，但未直接导出
 */
function defaultValue<T>(value: T | undefined | null, defaultValue: T): T {
  return value !== undefined && value !== null ? value : defaultValue
}

// 添加 EMPTY_OBJECT 常量（Cesium 内部使用）
(defaultValue as any).EMPTY_OBJECT = {}

import defaultImage from "@/assets/images/colors1.png";
import type { CesiumImage } from "@/types/Common";

type PolylineFlowMaterialOptions = {
  color?: Property | Color;
  image?: CesiumImage;
  forward?: Property | number;
  speed?: Property | number;
  repeat?: Property | Cartesian2;
};

const defaultOptions: PolylineFlowMaterialOptions = {
  image: defaultImage,
  color: Color.WHITE,
  forward: 1,
  speed: 1,
  repeat: new Cartesian2(1.0, 1.0),
};

/**
 * 一个 {@link MaterialProperty}，用于映射折线流动材质的 {@link Material} uniforms。
 * @alias PolylineFlowMaterialProperty
 * @constructor
 *
 * @param {PolylineFlowMaterialOptions} [options] 包含以下属性的配置对象：
 * @param {PolylineFlowMaterialOptions['color']} [options.color=Color.WHITE] 用于指定线条颜色的 {@link Color} 属性。
 * @param {PolylineFlowMaterialOptions['image']} [options.image=defaultImage] 用于指定纹理图像的属性，可以是字符串、HTML 图像或画布。
 * @param {PolylineFlowMaterialOptions['forward']} [options.forward=1.0] 用于指定流动方向的数值属性，1 表示正向流动。
 * @param {PolylineFlowMaterialOptions['speed']} [options.speed=1.0] 用于指定流动速度的数值属性。
 * @param {PolylineFlowMaterialOptions['repeat']} [options.repeat=new Cartesian2(1.0, 1.0)] 用于指定纹理重复模式的 {@link Cartesian2} 属性。
 */
function PolylineFlowMaterialProperty(options: PolylineFlowMaterialOptions) {
  options = defaultValue(
    options,
    (defaultValue as any).EMPTY_OBJECT as Record<string, any>
  );

  this._definitionChanged = new Event();
  this._color = undefined;
  this._colorSubscription = undefined;
  this._image = undefined;
  this._imageSubscription = undefined;
  this._forward = undefined;
  this._forwardSubscription = undefined;
  this._speed = undefined;
  this._speedSubscription = undefined;
  this._repeat = undefined;
  this._repeatSubscription = undefined;

  // 初始化属性，使用默认值或从 options 中获取
  this.color = options.color || defaultOptions.color;
  this.image = options.image || defaultOptions.image;
  this.forward = options.forward || defaultOptions.forward;
  this.speed = options.speed || defaultOptions.speed;
  this.repeat = options.repeat || defaultOptions.repeat;
}

Object.defineProperties(PolylineFlowMaterialProperty.prototype, {
  /**
   * 获取此属性是否为常量。如果 getValue 对当前定义总是返回相同结果，则属性被认为是常量。
   * @memberof PolylineFlowMaterialProperty.prototype
   * @type {boolean}
   * @readonly
   */
  isConstant: {
    get: function (): boolean {
      return (
        (Property as any).isConstant(this._color) &&
        (Property as any).isConstant(this._image) &&
        (Property as any).isConstant(this._forward) &&
        (Property as any).isConstant(this._speed) &&
        (Property as any).isConstant(this._repeat)
      );
    },
  },
  /**
   * 当属性定义发生变化时触发的事件。
   * @memberof PolylineFlowMaterialProperty.prototype
   * @type {Event}
   * @readonly
   */
  definitionChanged: {
    get: function (): Event {
      return this._definitionChanged;
    },
  },
  /**
   * 获取或设置用于指定线条颜色的 {@link Color} 属性。
   * @memberof PolylineFlowMaterialProperty.prototype
   * @type {Property|Color}
   */
  color: createPropertyDescriptor("color"),

  /**
   * 获取或设置用于指定纹理图像的属性。
   * @memberof PolylineFlowMaterialProperty.prototype
   * @type {Property|string|HTMLImageElement|HTMLCanvasElement}
   */
  image: createPropertyDescriptor("image"),

  /**
   * 获取或设置指定流动方向的数值属性。
   * @memberof PolylineFlowMaterialProperty.prototype
   * @type {Property|number}
   */
  forward: createPropertyDescriptor("forward"),

  /**
   * 获取或设置指定流动速度的数值属性。
   * @memberof PolylineFlowMaterialProperty.prototype
   * @type {Property|number}
   */
  speed: createPropertyDescriptor("speed"),

  /**
   * 获取或设置指定纹理重复模式的 {@link Cartesian2} 属性。
   * @memberof PolylineFlowMaterialProperty.prototype
   * @type {Property|Cartesian2}
   */
  repeat: createPropertyDescriptor("repeat"),
});

/**
 * 获取指定时间的材质类型。
 *
 * @param {JulianDate} time 检索类型的时间。
 * @returns {string} 材质类型。
 */
PolylineFlowMaterialProperty.prototype.getType = function (time): string {
  return "PolylineFlow";
};

const timeScratch = new JulianDate();

/**
 * 每次渲染时调用，将结果存储到 result 中。
 *
 * @param {JulianDate} [time=JulianDate.now()] 获取值的时间。如果省略，使用当前时间。
 * @param {object} [result] 将值存储到其中的对象。如果省略，则创建新对象。
 * @returns {object} 包含结果的对象。
 */
PolylineFlowMaterialProperty.prototype.getValue = function (
  time,
  result
): Record<string, any> {
  if (!defined(time)) {
    time = JulianDate.now(timeScratch);
  }
  if (!defined(result)) {
    result = {};
  }
  result.color = (Property as any).getValueOrClonedDefault(
    this._color,
    time,
    defaultOptions.color,
    result.color
  );
  result.image = (Property as any).getValueOrClonedDefault(
    this._image,
    time,
    defaultOptions.image,
    result.image
  );
  result.forward = (Property as any).getValueOrClonedDefault(
    this._forward,
    time,
    defaultOptions.forward,
    result.forward
  );
  result.speed = (Property as any).getValueOrClonedDefault(
    this._speed,
    time,
    defaultOptions.speed,
    result.speed
  );
  result.repeat = (Property as any).getValueOrClonedDefault(
    this._repeat,
    time,
    defaultOptions.repeat,
    result.repeat
  );
  return result;
};

/**
 * 比较当前属性与提供的属性，返回它们是否相等。
 *
 * @param {Property} [other] 另一个属性。
 * @returns {boolean} 如果相等返回 true，否则返回 false。
 */
PolylineFlowMaterialProperty.prototype.equals = function (
  other: Record<string, any>
): boolean {
  return (
    this === other ||
    (other instanceof PolylineFlowMaterialProperty &&
      (Property as any).equals(this._color, other._color) &&
      (Property as any).equals(this._image, other._image) &&
      (Property as any).equals(this._forward, other._forward) &&
      (Property as any).equals(this._speed, other._speed) &&
      (Property as any).equals(this._repeat, other._repeat))
  );
};

export default PolylineFlowMaterialProperty;
