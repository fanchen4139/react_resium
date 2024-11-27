import {
  Color,
  defined,
  Event,
  Material,
  Property,
  createPropertyDescriptor,
} from "cesium";
import defaultImage from "../../../public/colors1.png";
const defaultColor = Color.fromCssColorString("rgba(0, 255, 255, 1)");
const defaultSpeed = 1;
const defaultRepeat = 1;

export class WallMaterialProperty {
  constructor(options = {}) {
    this._definitionChanged = new Event();
    // 定义材质变量
    this._color = undefined;
    this._image = undefined;
    this._speed = undefined;
    this._repeat = undefined;
    // 变量初始化
    this.color = options.color || defaultColor;
    this.image = options.image || defaultImage;
    this.speed = options.speed || defaultSpeed;
    this.repeat = options.repeat || defaultRepeat;
    // 注册材质
    Material._materialCache.addMaterial("WallMaterial", {
      fabric: {
        type: "WallMaterial",
        uniforms: {
          image: "/colors1.png", //选择自己的动态材质图片
          color: Color.TRANSPARENT,
          repeat: 2.0,
          speed: 1.0,
        },
        source: `czm_material czm_getMaterial(czm_materialInput materialInput)
                {
                    czm_material material = czm_getDefaultMaterial(materialInput);
                    vec2 st = materialInput.st * repeat;
                    // 1.0 + 0.3 * sin(time)
                    vec4 colorImage = texture(image, vec2(fract((st.t - speed*czm_frameNumber*0.005)), st.t));
                    // vec4 colorImage = texture(image, vec2(( sin(speed*czm_frameNumber*0.005) < 0.0 ? (1.0 + sin(speed*czm_frameNumber*0.005)) : (1.0 - sin(speed*czm_frameNumber*0.005)) ), st.t));
                    vec4 fragColor;
                    fragColor.rgb = color.rgb / 1.0;
                    fragColor = czm_gammaCorrect(fragColor);
                    material.alpha = colorImage.a * color.a;
                    material.diffuse = (colorImage.rgb+color.rgb)/2.0;
                    material.emission = fragColor.rgb;
                    return material;
                }`,
        /** // 纵向运动
   'czm_material czm_getMaterial(czm_materialInput materialInput)\n\
  {\n\
      czm_material material = czm_getDefaultMaterial(materialInput);\n\
      vec2 st = materialInput.st * repeat;\n\
      vec4 colorImage = texture(image, vec2(fract((st.t - speed*czm_frameNumber*0.005)), st.t));\n\
      vec4 fragColor;\n\
      fragColor.rgb = color.rgb / 1.0;\n\
      fragColor = czm_gammaCorrect(fragColor);\n\
      material.alpha = colorImage.a * color.a;\n\
      material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
      material.emission = fragColor.rgb;\n\
      return material;\n\
  }'
   */

        /** // 横向移动
  'czm_material czm_getMaterial(czm_materialInput materialInput)\n\
        {\n\
            czm_material material = czm_getDefaultMaterial(materialInput);\n\
            vec2 st = materialInput.st;\n\
            vec4 colorImage = texture(image, vec2(fract(st.s + speed * czm_frameNumber * 0.005), st.t));\n\
            vec4 fragColor;\n\
            fragColor.rgb = color.rgb / 1.0;\n\
            fragColor = czm_gammaCorrect(fragColor);\n\
            material.alpha = colorImage.a * color.a;\n\
            material.diffuse = (colorImage.rgb + color.rgb) / 2.0;\n\
            material.emission = fragColor.rgb;\n\
            return material;\n\
        }'
   */
        /** // 扩散运动
'czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
\n\
    // 将纹理坐标调整为以中心 (0.5, 0.5) 为基点\n\
    vec2 st = materialInput.st - vec2(0.5);\n\
\n\
    // 通过 sin 函数生成动态缩放比例\n\
    float time = czm_frameNumber * speed * 0.005; // 动态时间参数\n\
    float repeat = 1.0 + 0.3 * sin(time); // 缩放比例在 [0.7, 1.3] 之间循环变化\n\
    float angle = sin(time) * 3.14159; // 动态旋转角度\n\
mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));\n\
st = rotation * st;\n\
\n\
    // 应用缩放比例\n\
    st *= repeat;\n\
\n\
    // 恢复纹理坐标范围到 [0, 1]\n\
    st += vec2(0.5);\n\
\n\
    // 采样纹理图像\n\
    vec4 colorImage = texture(image, fract(st));\n\
\n\
    // 材质属性设置\n\
    material.alpha = colorImage.a * color.a;\n\
    material.diffuse = (colorImage.rgb + color.rgb) / 2.0;\n\
    material.emission = colorImage.rgb;\n\
\n\
    return material;\n\
}'
   */
      },
    });
  }

  // 材质类型
  getType() {
    return "WallMaterial";
  }

  // 每次渲染时被调用，result的参数会传入到 glsl 中
  getValue(time, result) {
    if (!defined(result)) {
      result = {};
    }

    result.color = Property.getValueOrClonedDefault(
      this._color,
      time,
      defaultColor,
      result.color
    );
    result.image = Property.getValueOrClonedDefault(
      this._image,
      time,
      defaultImage,
      result.image
    );
    result.speed = Property.getValueOrClonedDefault(
      this._speed,
      time,
      defaultSpeed,
      result.speed
    );
    result.repeat = Property.getValueOrClonedDefault(
      this._repeat,
      time,
      defaultRepeat,
      result.repeat
    );

    return result;
  }

  equals(other) {
    return (
      this === other ||
      (other instanceof WallMaterialProperty &&
        Property.equals(this._color, other._color) &&
        Property.equals(this._speed, other._speed) &&
        Property.equals(this._repeat, other._repeat) &&
        Property.equals(this._image, other._image))
    );
  }
}

Object.defineProperties(WallMaterialProperty.prototype, {
  isConstant: {
    get: function get() {
      return (
        Property.isConstant(this._color) &&
        Property.isConstant(this._image) &&
        Property.isConstant(this._repeat) &&
        Property.isConstant(this._speed)
      );
    },
  },

  definitionChanged: {
    get: function get() {
      return this._definitionChanged;
    },
  },

  color: createPropertyDescriptor("color"),
  image: createPropertyDescriptor("image"),
  speed: createPropertyDescriptor("speed"),
  repeat: createPropertyDescriptor("repeat"),
});

export default WallMaterialProperty;
