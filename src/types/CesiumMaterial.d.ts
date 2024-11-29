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

    let WallFlowUpType: "WallFlowUp";
    const WallFlowUpShader: Material;

    let WallFlowDownType: "WallFlowDown";
    const WallFlowDownShader: Material;

    let WallFlowClockwiseType: "WallFlowClockwise";
    const WallFlowClockwiseShader: Material;

    let WallFlowCounterclockwiseType: "WallFlowCounterclockwise";
    const WallFlowCounterclockwiseShader: Material;

    let PolylineFlowType: "PolylineFlow";
    const PolylineFlowShader: Material;
  }
}
