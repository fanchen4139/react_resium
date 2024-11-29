import { Cartesian2, Color, Material } from "cesium";
import PolylineFlowShader from "../Shaders/Materials/PolylineFlow.glsl";

// 定义材质类型和 Shader
Material.PolylineFlowType = "PolylineFlow";

// 注册材质
Material._materialCache.addMaterial(Material.PolylineFlowType, {
  fabric: {
    type: Material.PolylineFlowType,
    uniforms: {
      color: Color.TRANSPARENT,
      image: Material.DefaultImageId, //选择自己的动态材质图片
      speed: 1.0,
      forward: 1.0,
      glowPower: 0.1,
      repeat: new Cartesian2(1.0, 1.0),
    },
    source: PolylineFlowShader,
    /**
    czm_material czm_getMaterial(czm_materialInput materialInput)
    {
        czm_material material = czm_getDefaultMaterial(materialInput);

        vec2 st = materialInput.st;
        vec4 colorImage = texture(image, fract(vec2(st.s - speed * czm_frameNumber * 0.005 * forward, st.t) * repeat));

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
