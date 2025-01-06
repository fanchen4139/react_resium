import { Cartesian2, Color, Material } from "cesium";
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
      repeat: new Cartesian2(1, 1),
    },
    source: WallFlowUpShader,
  },
  // 设置半透明
  translucent: function (material) {
    return true;
  },
});
