import type { CesiumImage } from "@/types/Common";
import {
  Color,
  Event,
  Property,
  Material,
  Cartesian2,
  defaultValue,
  defined,
  // @ts-ignore
  createPropertyDescriptor,
  JulianDate,
} from "cesium";

export enum WallFlowShader {
  Up = "WallFlowUp", // 向上流动
  Down = "WallFlowDown", // 向下流动
  Clockwise = "WallFlowClockwise", // 顺时针流动
  Counterclockwise = "WallFlowCounterclockwise", // 逆时针流动
}

type WallFlowMaterialOptions = {
  color?: Property | Color;
  image?: CesiumImage;
  speed?: Property | number;
  repeat?: Property | number;
  shaderType?: WallFlowShader;
};

const defaultOptions: WallFlowMaterialOptions = {
  color: Color.WHITE,
  image: Material.DefaultImageId,
  speed: 1,
  repeat: 1,
  shaderType: WallFlowShader.Up,
};

/**
 * 一个 {@link MaterialProperty}，用于映射折线流动材质的 {@link Material} uniforms。
 * @alias WallFlowMaterialProperty
 * @constructor
 *
 * @param {WallFlowMaterialOptions} [options] 包含以下属性的配置对象：
 * @param {WallFlowMaterialOptions['color']} [options.color=Color.WHITE] 用于指定线条颜色的 {@link Color} 属性。
 * @param {WallFlowMaterialOptions['image']} [options.image=Material.DefaultImageId] 用于指定纹理图像的属性，可以是字符串、HTML 图像或画布。
 * @param {WallFlowMaterialOptions['speed']} [options.speed=1.0] 用于指定流动速度的数值属性。
 * @param {WallFlowMaterialOptions['repeat']} [options.repeat=1.0] 用于指定纹理重复次数的属性。
 * @param {WallFlowMaterialOptions['shaderType']} [options.shaderType=ShaderType.WallFlow] 用于指定纹理着色器的属性。
 */
function WallFlowMaterialProperty(options: WallFlowMaterialOptions) {
  options = defaultValue(
    options,
    (defaultValue as any).EMPTY_OBJECT as Record<string, any>
  );

  this._definitionChanged = new Event();
  this._color = undefined;
  this._colorSubscription = undefined;
  this._image = undefined;
  this._imageSubscription = undefined;
  this._speed = undefined;
  this._speedSubscription = undefined;
  this._repeat = undefined;
  this._repeatSubscription = undefined;
  this._shaderType = undefined;
  this._shaderTypeSubscription = undefined;

  // 初始化属性，使用默认值或从 options 中获取
  this.color = options.color || defaultOptions.color;
  this.image = options.image || defaultOptions.image;
  this.speed = options.speed || defaultOptions.speed;
  this.repeat = options.repeat || defaultOptions.repeat;
  this.shaderType = options.shaderType || defaultOptions.shaderType;
}

Object.defineProperties(WallFlowMaterialProperty.prototype, {
  /**
   * 获取此属性是否为常量。如果 getValue 对当前定义总是返回相同结果，则属性被认为是常量。
   * @memberof WallFlowMaterialProperty.prototype
   * @type {boolean}
   * @readonly
   */
  isConstant: {
    get: function (): boolean {
      return (
        (Property as any).isConstant(this._color) &&
        (Property as any).isConstant(this._image) &&
        (Property as any).isConstant(this._speed) &&
        (Property as any).isConstant(this._repeat) &&
        (Property as any).isConstant(this._shaderType)
      );
    },
  },
  /**
   * 当属性定义发生变化时触发的事件。
   * @memberof WallFlowMaterialProperty.prototype
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
   * @memberof WallFlowMaterialProperty.prototype
   * @type {Property|Color}
   */
  color: createPropertyDescriptor("color"),

  /**
   * 获取或设置用于指定纹理图像的属性。
   * @memberof WallFlowMaterialProperty.prototype
   * @type {Property|string|HTMLImageElement|HTMLCanvasElement}
   */
  image: createPropertyDescriptor("image"),

  /**
   * 获取或设置指定流动速度的数值属性。
   * @memberof WallFlowMaterialProperty.prototype
   * @type {Property|number}
   */
  speed: createPropertyDescriptor("speed"),

  /**
   * 获取或设置指定纹理重复模式的 {@link Cartesian2} 属性。
   * @memberof WallFlowMaterialProperty.prototype
   * @type {Property|Cartesian2}
   */
  repeat: createPropertyDescriptor("repeat"),

  /**
   * 获取或设置指定着色器的 {@link WallFlowShader} 属性。
   * @memberof WallFlowMaterialProperty.prototype
   * @type {WallFlowShader}
   */
  shaderType: createPropertyDescriptor("shaderType"),
});

/**
 * 获取指定时间的材质类型。
 *
 * @param {JulianDate} time 检索类型的时间。
 * @returns {string} 材质类型。
 */
WallFlowMaterialProperty.prototype.getType = function (time): string {
  return this.shaderType;
};

const timeScratch = new JulianDate();

/**
 * 每次渲染时调用，将结果存储到 result 中。
 *
 * @param {JulianDate} [time=JulianDate.now()] 获取值的时间。如果省略，使用当前时间。
 * @param {object} [result] 将值存储到其中的对象。如果省略，则创建新对象。
 * @returns {object} 包含结果的对象。
 */
WallFlowMaterialProperty.prototype.getValue = function (
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
WallFlowMaterialProperty.prototype.equals = function (
  other: Record<string, any>
): boolean {
  return (
    this === other ||
    (other instanceof WallFlowMaterialProperty &&
      (Property as any).equals(this._color, other._color) &&
      (Property as any).equals(this._image, other._image) &&
      (Property as any).equals(this._speed, other._speed) &&
      (Property as any).equals(this._repeat, other._repeat) &&
      (Property as any).equals(this._shaderType, other._shaderType))
  );
};

export default WallFlowMaterialProperty;
