import { Color, Material } from "cesium";
import * as Cesium from "cesium";
// 定义材质类型和 Shader
Material.CustomImageShaderType = "CustomImageShader";

// 注册材质
Material._materialCache.addMaterial(Material.CustomImageShaderType, {
  fabric: {
    type: Material.CustomImageShaderType,
    uniforms: {
      image: "/colors1.png", //选择自己的动态材质图片
      color: Color.TRANSPARENT,
      speed: 1.0,
    },
    source: `czm_material czm_getMaterial(czm_materialInput materialInput)
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
          }`,
  },
});
