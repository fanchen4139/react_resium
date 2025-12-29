import { memo, useMemo } from "react"
import { ParticleSystem, type ParticleSystemProps } from "resium"
import * as Cesium from "cesium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

type ParticleEmitterType = "box" | "sphere" | "cone"

type ParticleSystemWithLevaProps = Omit<
  ParticleSystemProps,
  "image" | "emitter"
> & {
  enableDebug?: boolean
  defaultImage?: string
}

const ParticleSystemWithLeva = ({
  enableDebug = true,
  defaultImage = "spark1.png",
  modelMatrix,
  ...props
}: ParticleSystemWithLevaProps) => {

  /**
   * Leva 控制
   */
  const params = useLevaControls(
    {
      name: "粒子系统 ParticleSystem",
      schema: {
        basic: folder({
          show: { label: "是否显示【show】", value: true },
          emissionRate: {
            label: "发射速率【emissionRate】(粒子/秒)",
            value: 500,
            min: 0,
            max: 3000,
            step: 10,
          },
          lifetime: {
            label: "系统寿命【lifetime】(秒,0=永久)",
            value: 3,
            min: 0,
            max: 60,
            step: 0.1,
          },
          sizeInMeters: {
            label: "按米计量【sizeInMeters】",
            value: true,
          },
        }),

        emitter: folder({
          emitterType: {
            label: "发射器类型【emitter】",
            value: "box" as ParticleEmitterType,
            options: {
              "立方体 Box": "box",
              "球体 Sphere": "sphere",
              "圆锥 Cone": "cone",
            },
          },
          param1: {
            label: "参数1【radius/size/angle】",
            value: 50,
            min: 1,
            max: 500,
            step: 1,
          },
          param2: {
            label: "参数2【cone-height】",
            value: 80,
            min: 1,
            max: 500,
            step: 1,
          },
        }),

        color: folder({
          startAlpha: { label: "初始透明度【startAlpha】", value: 0.6, min: 0, max: 1 },
          endAlpha: { label: "结束透明度【endAlpha】", value: 0.0, min: 0, max: 1 },
        }),

        size: folder({
          startScale: { label: "起始尺寸【startScale】", value: 3, min: 0.1, max: 20 },
          endScale: { label: "结束尺寸【endScale】", value: 8, min: 0.1, max: 20 },
        }),

        life: folder({
          minimumParticleLife: { label: "最小寿命【min life】", value: 1, min: 0.1, max: 20 },
          maximumParticleLife: { label: "最大寿命【max life】", value: 12, min: 0.1, max: 20 },
        }),

        speed: folder({
          minimumSpeed: { label: "最小速度【min speed】", value: 0.1, min: 0, max: 5 },
          maximumSpeed: { label: "最大速度【max speed】", value: 0.6, min: 0, max: 5 },
        }),
      },
      enabled: enableDebug,
    },
  )

  const {
    show,
    emissionRate,
    lifetime,
    sizeInMeters,
    startAlpha,
    endAlpha,
    startScale,
    endScale,
    minimumParticleLife,
    maximumParticleLife,
    minimumSpeed,
    maximumSpeed,
    emitterType,
    param1,
    param2,
  } = params

  /**
   * emitter 根据控制面板生成
   */
  const emitter = useMemo(() => {
    switch (emitterType) {
      case "sphere":
        return new Cesium.SphereEmitter(param1)

      case "cone":
        return new Cesium.ConeEmitter(
          Cesium.Math.toRadians(param1), // angle
        )

      case "box":
      default:
        return new Cesium.BoxEmitter(
          new Cesium.Cartesian3(param1, param2, param1),
        )
    }
  }, [emitterType, param1, param2])

  /**
   * 粒子属性
   */
  const particleProps = useMemo(
    () => ({
      image: defaultImage,
      startColor: Cesium.Color.GRAY.withAlpha(startAlpha),
      endColor: Cesium.Color.GRAY.withAlpha(endAlpha),
      startScale,
      endScale,
      minimumParticleLife,
      maximumParticleLife,
      minimumSpeed,
      maximumSpeed,
      emissionRate,
      lifetime: lifetime === 0 ? Number.POSITIVE_INFINITY : lifetime,
      sizeInMeters,
    }),
    [
      defaultImage,
      startAlpha,
      endAlpha,
      startScale,
      endScale,
      minimumParticleLife,
      maximumParticleLife,
      minimumSpeed,
      maximumSpeed,
      emissionRate,
      lifetime,
      sizeInMeters,
    ],
  )

  if (!show) return null

  return (
    <ParticleSystem
      {...props}
      {...particleProps}
      emitter={emitter}
      modelMatrix={modelMatrix}
    />
  )
}

export default memo(ParticleSystemWithLeva)
