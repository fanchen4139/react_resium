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
  buildModuleUrl,
} from "cesium";

export enum WaterShader {
  Up = "WaterUp", // 向上流动
  Down = "WaterDown", // 向下流动
  Clockwise = "WaterClockwise", // 顺时针流动
  Counterclockwise = "WaterCounterclockwise", // 逆时针流动
}

type WaterMaterialOptions = {
  normalMap?: Property | string | HTMLImageElement;
  frequency?: Property | number;
  animationSpeed?: Property | number;
  amplitude?: Property | number;
  specularIntensity?: Property | number;
  baseWaterColor?: Property | Color;
  blendColor?: Property | Color;
  specularMap?: Property | string;
  fadeFactor?: Property | number;
};

const defaultOptions: WaterMaterialOptions = {
  normalMap: Material.DefaultImageId,
  frequency: 40.0,
  animationSpeed: 0.003,
  amplitude: 10,
  specularIntensity: 0.01,
  baseWaterColor: new Color(0.2, 0.3, 0.6, 1.0),
  blendColor: new Color(0.0, 1.0, 0.699, 1.0),
  specularMap: Material.DefaultImageId,
  fadeFactor: 1.0,
};

/**
 * 一个 {@link MaterialProperty}，用于映射折线流动材质的 {@link Material} uniforms。
 * @alias WaterMaterialProperty
 * @constructor
 *
 * @param {WaterMaterialOptions} [options] 包含以下属性的配置对象：
 * @param {WaterMaterialOptions['normalMap']} [options.normalMap=normalMap.WHITE] 用于指定线条颜色的 {@link normalMap} 属性。
 * @param {WaterMaterialOptions['frequency']} [options.frequency=Material.DefaultfrequencyId] 用于指定纹理图像的属性，可以是字符串、HTML 图像或画布。
 * @param {WaterMaterialOptions['animationSpeed']} [options.animationSpeed=1.0] 用于指定流动速度的数值属性。
 * @param {WaterMaterialOptions['amplitude']} [options.amplitude=1.0] 用于指定纹理重复次数的属性。
 * @param {WaterMaterialOptions['specularIntensity']} [options.specularIntensity=specularIntensity.Water] 用于指定纹理着色器的属性。
 */
function WaterMaterialProperty(options: WaterMaterialOptions = {}) {
  options = defaultValue(
    options,
    (defaultValue as any).EMPTY_OBJECT as Record<string, any>
  );

  this._definitionChanged = new Event();
  this._normalMap = undefined;
  this._normalMapSubscription = undefined;
  this._frequency = undefined;
  this._frequencySubscription = undefined;
  this._animationSpeed = undefined;
  this._animationSpeedSubscription = undefined;
  this._amplitude = undefined;
  this._amplitudeSubscription = undefined;
  this._specularIntensity = undefined;
  this._specularIntensitySubscription = undefined;
  this._baseWaterColor = undefined;
  this._baseWaterColorSubscription = undefined;
  this._blendColor = undefined;
  this._blendColorSubscription = undefined;
  this._specularMap = undefined;
  this._specularMapSubscription = undefined;
  this._fadeFactor = undefined;
  this._fadeFactorSubscription = undefined;

  // 初始化属性，使用默认值或从 options 中获取
  this.normalMap = options.normalMap || defaultOptions.normalMap;
  this.frequency = options.frequency || defaultOptions.frequency;
  this.animationSpeed = options.animationSpeed || defaultOptions.animationSpeed;
  this.amplitude = options.amplitude || defaultOptions.amplitude;
  this.specularIntensity =
    options.specularIntensity || defaultOptions.specularIntensity;
  this.baseWaterColor = options.baseWaterColor || defaultOptions.baseWaterColor;
  this.blendColor = options.blendColor || defaultOptions.blendColor;
  this.specularMap = options.specularMap || defaultOptions.specularMap;
  this.fadeFactor = options.fadeFactor || defaultOptions.fadeFactor;
}

Object.defineProperties(WaterMaterialProperty.prototype, {
  /**
   * 获取此属性是否为常量。如果 getValue 对当前定义总是返回相同结果，则属性被认为是常量。
   * @memberof WaterMaterialProperty.prototype
   * @type {boolean}
   * @readonly
   */
  isConstant: {
    get: function (): boolean {
      return (
        (Property as any).isConstant(this._normalMap) &&
        (Property as any).isConstant(this._frequency) &&
        (Property as any).isConstant(this._animationSpeed) &&
        (Property as any).isConstant(this._amplitude) &&
        (Property as any).isConstant(this._specularIntensity) &&
        (Property as any).isConstant(this._baseWaterColor) &&
        (Property as any).isConstant(this._blendColor) &&
        (Property as any).isConstant(this._specularMap) &&
        (Property as any).isConstant(this._fadeFactor)
      );
    },
  },
  /**
   * 当属性定义发生变化时触发的事件。
   * @memberof WaterMaterialProperty.prototype
   * @type {Event}
   * @readonly
   */
  definitionChanged: {
    get: function (): Event {
      return this._definitionChanged;
    },
  },
  /**
   * 获取或设置用于指定线条颜色的 {@link normalMap} 属性。
   * @memberof WaterMaterialProperty.prototype
   * @type {Property|normalMap}
   */
  normalMap: createPropertyDescriptor("normalMap"),

  /**
   * 获取或设置用于指定纹理图像的属性。
   * @memberof WaterMaterialProperty.prototype
   * @type {Property|string|HTMLfrequencyElement|HTMLCanvasElement}
   */
  frequency: createPropertyDescriptor("frequency"),

  /**
   * 获取或设置指定流动速度的数值属性。
   * @memberof WaterMaterialProperty.prototype
   * @type {Property|number}
   */
  animationSpeed: createPropertyDescriptor("animationSpeed"),

  /**
   * 获取或设置指定纹理重复模式的 {@link Cartesian2} 属性。
   * @memberof WaterMaterialProperty.prototype
   * @type {Property|Cartesian2}
   */
  amplitude: createPropertyDescriptor("amplitude"),

  /**
   * 获取或设置指定着色器的 {@link WaterShader} 属性。
   * @memberof WaterMaterialProperty.prototype
   * @type {WaterShader}
   */
  specularIntensity: createPropertyDescriptor("specularIntensity"),
  /**
   * 获取或设置指定着色器的 {@link WaterShader} 属性。
   * @memberof WaterMaterialProperty.prototype
   * @type {WaterShader}
   */
  baseWaterColor: createPropertyDescriptor("baseWaterColor"),
  /**
   * 获取或设置指定着色器的 {@link WaterShader} 属性。
   * @memberof WaterMaterialProperty.prototype
   * @type {WaterShader}
   */
  blendColor: createPropertyDescriptor("blendColor"),
  /**
   * 获取或设置指定着色器的 {@link WaterShader} 属性。
   * @memberof WaterMaterialProperty.prototype
   * @type {WaterShader}
   */
  specularMap: createPropertyDescriptor("specularMap"),
  /**
   * 获取或设置指定着色器的 {@link WaterShader} 属性。
   * @memberof WaterMaterialProperty.prototype
   * @type {WaterShader}
   */
  fadeFactor: createPropertyDescriptor("fadeFactor"),
});

/**
 * 获取指定时间的材质类型。
 *
 * @param {JulianDate} time 检索类型的时间。
 * @returns {string} 材质类型。
 */
WaterMaterialProperty.prototype.getType = function (time): string {
  return "Water";
};

const timeScratch = new JulianDate();

/**
 * 每次渲染时调用，将结果存储到 result 中。
 *
 * @param {JulianDate} [time=JulianDate.now()] 获取值的时间。如果省略，使用当前时间。
 * @param {object} [result] 将值存储到其中的对象。如果省略，则创建新对象。
 * @returns {object} 包含结果的对象。
 */
WaterMaterialProperty.prototype.getValue = function (
  time,
  result
): Record<string, any> {
  if (!defined(time)) {
    time = JulianDate.now(timeScratch);
  }
  if (!defined(result)) {
    result = {};
  }
  result.normalMap = (Property as any).getValueOrClonedDefault(
    this._normalMap,
    time,
    defaultOptions.normalMap,
    result.normalMap
  );
  result.frequency = (Property as any).getValueOrClonedDefault(
    this._frequency,
    time,
    defaultOptions.frequency,
    result.frequency
  );
  result.animationSpeed = (Property as any).getValueOrClonedDefault(
    this._animationSpeed,
    time,
    defaultOptions.animationSpeed,
    result.animationSpeed
  );
  result.amplitude = (Property as any).getValueOrClonedDefault(
    this._amplitude,
    time,
    defaultOptions.amplitude,
    result.amplitude
  );
  result.specularIntensity = (Property as any).getValueOrClonedDefault(
    this._specularIntensity,
    time,
    defaultOptions.specularIntensity,
    result.specularIntensity
  );
  result.baseWaterColor = (Property as any).getValueOrClonedDefault(
    this._baseWaterColor,
    time,
    defaultOptions.baseWaterColor,
    result.baseWaterColor
  );
  result.blendColor = (Property as any).getValueOrClonedDefault(
    this._blendColor,
    time,
    defaultOptions.blendColor,
    result.blendColor
  );
  result.specularMap = (Property as any).getValueOrClonedDefault(
    this._specularMap,
    time,
    defaultOptions.specularMap,
    result.specularMap
  );
  result.fadeFactor = (Property as any).getValueOrClonedDefault(
    this._fadeFactor,
    time,
    defaultOptions.fadeFactor,
    result.fadeFactor
  );
  return result;
};

/**
 * 比较当前属性与提供的属性，返回它们是否相等。
 *
 * @param {Property} [other] 另一个属性。
 * @returns {boolean} 如果相等返回 true，否则返回 false。
 */
WaterMaterialProperty.prototype.equals = function (
  other: Record<string, any>
): boolean {
  return (
    this === other ||
    (other instanceof WaterMaterialProperty &&
      (Property as any).equals(this._normalMap, other._normalMap) &&
      (Property as any).equals(this._frequency, other._frequency) &&
      (Property as any).equals(this._animationSpeed, other._animationSpeed) &&
      (Property as any).equals(this._amplitude, other._amplitude) &&
      (Property as any).equals(
        this._specularIntensity,
        other._specularIntensity
      ) &&
      (Property as any).equals(this._baseWaterColor, other._baseWaterColor) &&
      (Property as any).equals(this._blendColor, other._blendColor) &&
      (Property as any).equals(this._specularMap, other._specularMap) &&
      (Property as any).equals(this._fadeFactor, other._fadeFactor))
  );
};

export default WaterMaterialProperty;
