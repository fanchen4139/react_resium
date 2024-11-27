import {
  defined,
  Event,
  Material,
  Property,
  createPropertyDescriptor,
  buildModuleUrl,
} from "cesium";
// import defaultAnimationamplitude from "../../../public/frequencys1.png";
const defaultFrequency = 40.0;
const defaultAnimationamplitude = 0.003;
const defaultAmplitude = 10;
const defaultSpecularIntensity = 0.01;

export class WaterMaterialProperty {
  constructor(options = {}) {
    this._definitionChanged = new Event();
    // 定义材质变量
    this._frequency = undefined;
    this._animationamplitude = undefined;
    this._amplitude = undefined;
    this._specularIntensity = undefined;
    // 变量初始化
    this.frequency = options.frequency || defaultFrequency;
    this.animationamplitude =
      options.animationamplitude || defaultAnimationamplitude;
    this.amplitude = options.amplitude || defaultAmplitude;
    this.specularIntensity =
      options.specularIntensity || defaultSpecularIntensity;
    // 注册材质
    Material._materialCache.addMaterial("Water", {
      fabric: {
        type: "Water",
        uniforms: {
          // 水的颜色
          // baseWaterfrequency: Cesium.frequency.RED,
          // 从水到非水区域混合时使用的rgba颜色
          // blendfrequency: Cesium.frequency.DARKBLUE
          /* 一张黑白图用来作为标识哪里是用水来渲染的贴图
          如果不指定，则代表使用该material的primitive区域全部都是水，
          如果指定全黑色的图，则表示该区域没有水，
          如果是灰色的，则代表水的透明度，
          这里一般是指定都是要么有水，要么没有水，而且对于不是矩形的primitive区域，最好定义全是白色，
          不然很难绘制出一张贴图正好能保证需要的地方有水，不需要的地方没有水
          */
          // specularMap: "",
          // 用来生成起伏效果的法线贴图
          normalMap: buildModuleUrl("Assets/Textures/waterNormals.jpg"),
          // 水浪的波动
          frequency: defaultFrequency,
          // 水波振幅
          animationamplitude: defaultAnimationamplitude,
          // 水流速度
          amplitude: defaultAmplitude,
          // 镜面反射强度
          specularIntensity: defaultSpecularIntensity,
        },
      },

      source: `czm_material czm_getMaterial(czm_materialInput materialInput)
      {
          czm_material material = czm_getDefaultMaterial(materialInput);
          vec2 st = materialInput.st * repeat;
          // 1.0 + 0.3 * sin(time)
          vec4 colorImage = texture(normalMap, vec2(fract((st.t - czm_frameNumber*0.005)), st.t));
          // material.alpha = colorImage.a * color.a;
          // material.diffuse = (colorImage.rgb+color.rgb)/2.0;
          // material.emission = fragColor.rgb;
          return material;
      }`,
    });
  }

  // 材质类型
  getType() {
    return "Water";
  }

  // 每次渲染时被调用，result的参数会传入到 glsl 中
  getValue(time, result) {
    if (!defined(result)) {
      result = {};
    }

    result.frequency = Property.getValueOrClonedDefault(
      this._frequency,
      time,
      defaultFrequency,
      result.frequency
    );
    result.animationamplitude = Property.getValueOrClonedDefault(
      this._animationamplitude,
      time,
      defaultAnimationamplitude,
      result.animationamplitude
    );
    result.amplitude = Property.getValueOrClonedDefault(
      this._amplitude,
      time,
      defaultAmplitude,
      result.amplitude
    );
    result.specularIntensity = Property.getValueOrClonedDefault(
      this._specularIntensity,
      time,
      defaultSpecularIntensity,
      result.specularIntensity
    );

    return result;
  }

  equals(other) {
    return (
      this === other ||
      (other instanceof WaterMaterialProperty &&
        Property.equals(this._frequency, other._frequency) &&
        Property.equals(this._amplitude, other._amplitude) &&
        Property.equals(this._specularIntensity, other._specularIntensity) &&
        Property.equals(this._animationamplitude, other._animationamplitude))
    );
  }
}

Object.defineProperties(WaterMaterialProperty.prototype, {
  isConstant: {
    get: function get() {
      return (
        Property.isConstant(this._frequency) &&
        Property.isConstant(this._animationamplitude) &&
        Property.isConstant(this._specularIntensity) &&
        Property.isConstant(this._amplitude)
      );
    },
  },

  definitionChanged: {
    get: function get() {
      return this._definitionChanged;
    },
  },

  frequency: createPropertyDescriptor("frequency"),
  animationamplitude: createPropertyDescriptor("animationamplitude"),
  amplitude: createPropertyDescriptor("amplitude"),
  specularIntensity: createPropertyDescriptor("specularIntensity"),
});

export default WaterMaterialProperty;
