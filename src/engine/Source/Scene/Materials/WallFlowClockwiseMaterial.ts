import { Cartesian2, Color, Material } from "cesium";
import WallFlowClockwiseShader from "../Shaders/Materials/WallFlowClockwise.glsl";

const TYPE = "WallFlowClockwise";

Material.WallFlowClockwiseType = TYPE;

Material._materialCache.addMaterial(TYPE, {
  fabric: {
    type: TYPE,
    uniforms: {
      image: Material.DefaultImageId, //选择自己的动态材质图片
      color: Color.TRANSPARENT,
      speed: 1.0,
      repeat: new Cartesian2(1, 1),
    },
    source: WallFlowClockwiseShader,
  },
  translucent: () => true, // ✅ 明确声明（推荐）
});
