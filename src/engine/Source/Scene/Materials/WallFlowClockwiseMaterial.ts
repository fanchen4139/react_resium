import { Cartesian2, Color, Material } from "cesium";
import WallFlowClockwiseShader from "../Shaders/Materials/WallFlowClockwise.glsl";

// 定义材质类型和 Shader
Material.WallFlowClockwiseType = "WallFlowClockwise";

// 注册材质
Material._materialCache.addMaterial(Material.WallFlowClockwiseType, {
  fabric: {
    type: Material.WallFlowClockwiseType,
    uniforms: {
      image: Material.DefaultImageId, //选择自己的动态材质图片
      color: Color.TRANSPARENT,
      speed: 1.0,
      repeat: new Cartesian2(1, 1),
    },
    source: WallFlowClockwiseShader,
  },
});
