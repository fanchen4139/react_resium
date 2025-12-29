import { Cartesian2, Color, Material } from "cesium";
import WallFlowCounterclockwiseShader from "../Shaders/Materials/WallFlowCounterclockwise.glsl";

const TYPE = "WallFlowCounterclockwise";

Material.WallFlowCounterclockwiseType = TYPE;

Material._materialCache.addMaterial(TYPE, {
  fabric: {
    type: TYPE,
    uniforms: {
      image: Material.DefaultImageId, //选择自己的动态材质图片
      color: Color.TRANSPARENT,
      speed: 1.0,
      repeat: new Cartesian2(1, 1),
    },
    source: WallFlowCounterclockwiseShader,
  },
});