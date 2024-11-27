declare module "cesium" {
  export namespace Material {
    const _materialCache: {
      addMaterial(
        type: string,
        options: {
          fabric: {
            type: string;
            uniforms: Record<string, any>;
            source: string;
          };
          translucent?: (material: Material) => boolean;
        }
      ): void;
    };

    let CustomImageShaderType: "CustomImageShader";
    const CustomImageShader: Material;
  }
}
