import { Color, Material } from "cesium";
import WallFlowUpShader from "../Shaders/Materials/WallFlowUp.glsl";

// 定义材质类型和 Shader
Material.WallFlowUpType = "WallFlowUp";

// 注册材质
Material._materialCache.addMaterial(Material.WallFlowUpType, {
  fabric: {
    type: Material.WallFlowUpType,
    uniforms: {
      image: Material.DefaultImageId, //选择自己的动态材质图片
      color: Color.TRANSPARENT,
      speed: 1.0,
    },
    source: WallFlowUpShader,
    /**
    czm_material czm_getMaterial(czm_materialInput materialInput)
    {
        czm_material material = czm_getDefaultMaterial(materialInput);

        vec2 st = materialInput.st * 4.0;
        vec4 colorImage = texture(image, vec2(fract(st.s + speed * czm_frameNumber * 0.005), st.t));
        vec4 fragColor;

        fragColor.rgb = color.rgb / 1.0;
        fragColor = czm_gammaCorrect(fragColor);

        material.alpha = colorImage.a * color.a;
        material.diffuse = (colorImage.rgb + color.rgb) / 2.0;
        material.emission = fragColor.rgb;

        return material;
    }
    */
  },
});

// 其他动画效果执行代码
// 'czm_material czm_getMaterial(czm_materialInput materialInput)\n\
//   {\n\
//       czm_material material = czm_getDefaultMaterial(materialInput);\n\
//       vec2 st = materialInput.st * scale;\n\
//       vec4 colorImage = texture(image, vec2(fract((st.t - speed*czm_frameNumber*0.005)), st.t));\n\
//       vec4 fragColor;\n\
//       fragColor.rgb = color.rgb / 1.0;\n\
//       fragColor = czm_gammaCorrect(fragColor);\n\
//       material.alpha = colorImage.a * color.a;\n\
//       material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
//       material.emission = fragColor.rgb;\n\
//       return material;\n\
//   }'

/** // 纵向运动
   'czm_material czm_getMaterial(czm_materialInput materialInput)\n\
  {\n\
      czm_material material = czm_getDefaultMaterial(materialInput);\n\
      vec2 st = materialInput.st * scale;\n\
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
    float scale = 1.0 + 0.3 * sin(time); // 缩放比例在 [0.7, 1.3] 之间循环变化\n\
    float angle = sin(time) * 3.14159; // 动态旋转角度\n\
mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));\n\
st = rotation * st;\n\
\n\
    // 应用缩放比例\n\
    st *= scale;\n\
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
