import { ParticleSystem, ScreenSpaceEvent, ScreenSpaceEventHandler, useCesium } from "resium";
import * as Cesium from "cesium";
import { useMemo, useRef, useState } from "react";
import { useFrame } from "@/hooks/useFrame";
import ParticleSystemWithLeva from "@/components/ResiumDebug/ParticleSystemWithLeva";

type Props = {
  shader: Cesium.CustomShader;
  maxHeight: number;
};

export function GrowthWithParticles({
  shader,
  maxHeight,
}: Props) {
  const { viewer } = useCesium();
  const { clock } = viewer;
  clock.clockRange = Cesium.ClockRange.UNBOUNDED
  const startTimeRef = useRef<Cesium.JulianDate>(
    clock.startTime.clone()
  );
  // 用 ref 保存 matrix，避免重复 new
  const modelMatrixRef = useRef(
    Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(116.385465, 39.84426, 0))
  );

  const [height, setHeight] = useState(0)
  /** 每帧：算 progress → height */
  useFrame(() => {
    const elapsed = Cesium.JulianDate.secondsDifference(
      clock.currentTime,
      startTimeRef.current
    );

    const duration = Cesium.JulianDate.secondsDifference(
      clock.stopTime,
      clock.startTime
    );

    const progress = Cesium.Math.clamp(elapsed / duration, 0, 1);
    const height = progress * 2400;

    // 驱动 shader（几何生长）
    shader.uniforms.u_height.value = height;
    setHeight(height)

    // 更新粒子发射高度

    Cesium.Matrix4.fromTranslation(
      new Cesium.Cartesian3(116.385465, 39.84426, height),
      modelMatrixRef.current
    );
  });

  return (
    <>
      <ParticleSystemWithLeva
        modelMatrix={modelMatrixRef.current}
      />
    </>
  );
}
