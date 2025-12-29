import * as Cesium from "cesium";

export function createGrowthShader(maxHeight: number) {
  return new Cesium.CustomShader({
    uniforms: {
      u_height: {
        type: Cesium.UniformType.FLOAT,
        value: 0,
      },
      u_maxHeight: {
        type: Cesium.UniformType.FLOAT,
        value: maxHeight,
      },
      u_time: {
        type: Cesium.UniformType.FLOAT,
        value: 0,
      },
    },

    fragmentShaderText: `
      void fragmentMain(
        FragmentInput fsInput,
        inout czm_modelMaterial material
      ) {
        float h = fsInput.attributes.positionMC.z;

        // 超过生长高度的部分直接裁剪
        if (h > u_height) {
          discard;
        }

        // 生长边缘高亮（可选）
        float edge = smoothstep(u_height - 0.5, u_height, h);
        material.emissive += vec3(1.0, 0.8, 0.3) * edge * 0.3;
      }
    `,
  });
}
