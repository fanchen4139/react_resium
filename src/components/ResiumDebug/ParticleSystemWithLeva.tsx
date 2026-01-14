import { memo, useMemo } from "react"
import { ParticleSystem, type ParticleSystemProps } from "resium"
import * as Cesium from "cesium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

type ParticleEmitterType = "box" | "sphere" | "cone"

type ParticleSystemWithLevaProps = Omit<
  ParticleSystemProps,
  "show" | "emitter" | "modelMatrix" | "emitterModelMatrix" | "emissionRate" | "bursts" | "loop" | "startScale" | "endScale" | "startColor" | "endColor" | "image" | "imageSize" | "minimumImageSize" | "maximumImageSize" | "speed" | "minimumSpeed" | "maximumSpeed" | "lifetime" | "particleLife" | "minimumParticleLife" | "maximumParticleLife" | "mass" | "minimumMass" | "maximumMass" | "sizeInMeters"
> & {
  enableDebug?: boolean
  defaultImage?: string
}

const ParticleSystemWithLeva = ({
  enableDebug = true,
  defaultImage = "spark1.png",
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
          loop: { label: "循环 loop", value: true },
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
          particleLife: {
            label: "粒子寿命【particleLife】",
            value: 0,
            min: 0,
            max: 60,
            step: 0.1,
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
          useEmitterModelMatrix: { label: "emitterModelMatrix【发射器矩阵】", value: false },
          emitterOffsetX: { label: "emitter 偏移 X", value: 0, step: 1 },
          emitterOffsetY: { label: "emitter 偏移 Y", value: 0, step: 1 },
          emitterOffsetZ: { label: "emitter 偏移 Z", value: 0, step: 1 },
        }),

        color: folder({
          startColor: { label: "startColor【起始颜色】", value: "#808080" },
          endColor: { label: "endColor【结束颜色】", value: "#808080" },
          startAlpha: { label: "初始透明度【startAlpha】", value: 0.6, min: 0, max: 1 },
          endAlpha: { label: "结束透明度【endAlpha】", value: 0.0, min: 0, max: 1 },
        }),

        size: folder({
          startScale: { label: "起始尺寸【startScale】", value: 3, min: 0.1, max: 20 },
          endScale: { label: "结束尺寸【endScale】", value: 8, min: 0.1, max: 20 },
          imageWidth: { label: "imageSize width【图像尺寸宽】", value: 15, min: 0, step: 1 },
          imageHeight: { label: "imageSize height【图像尺寸高】", value: 15, min: 0, step: 1 },
          minImageWidth: { label: "minimumImageSize width【最小图像尺寸宽】", value: 1, min: 0, step: 1 },
          minImageHeight: { label: "minimumImageSize height【最小图像尺寸高】", value: 1, min: 0, step: 1 },
          maxImageWidth: { label: "maximumImageSize width【最大图像尺寸宽】", value: 20, min: 0, step: 1 },
          maxImageHeight: { label: "maximumImageSize height【最大图像尺寸高】", value: 20, min: 0, step: 1 },
        }),

        life: folder({
          minimumParticleLife: { label: "最小寿命【min life】", value: 1, min: 0.1, max: 20 },
          maximumParticleLife: { label: "最大寿命【max life】", value: 12, min: 0.1, max: 20 },
        }),

        speed: folder({
          speed: { label: "速度 speed", value: 0, min: 0, max: 5, step: 0.1 },
          minimumSpeed: { label: "最小速度【min speed】", value: 0.1, min: 0, max: 5 },
          maximumSpeed: { label: "最大速度【max speed】", value: 0.6, min: 0, max: 5 },
        }),
        mass: folder({
          mass: { label: "质量 mass", value: 0, min: 0, step: 0.1 },
          minimumMass: { label: "最小质量 minMass", value: 1, min: 0, step: 0.1 },
          maximumMass: { label: "最大质量 maxMass", value: 10, min: 0, step: 0.1 },
        }),
        bursts: folder({
          enableBurst: { label: "burst【爆发】", value: false },
          burstTime: { label: "burst time【爆发时间】", value: 0.5, min: 0, step: 0.1 },
          burstMin: { label: "burst minimum【最小爆发】", value: 10, min: 0, step: 1 },
          burstMax: { label: "burst maximum【最大爆发】", value: 100, min: 0, step: 1 },
        }),
        modelMatrix: folder({
          useModelMatrix: { label: "modelMatrix【模型矩阵】", value: false },
          modelLng: { label: "经度", value: 116.395102, step: 0.00001 },
          modelLat: { label: "纬度", value: 39.868458, step: 0.00001 },
          modelHeight: { label: "高度", value: 0, step: 10 },
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
    loop,
    particleLife,
    startColor,
    endColor,
    startAlpha,
    endAlpha,
    startScale,
    endScale,
    imageWidth,
    imageHeight,
    minImageWidth,
    minImageHeight,
    maxImageWidth,
    maxImageHeight,
    minimumParticleLife,
    maximumParticleLife,
    speed,
    minimumSpeed,
    maximumSpeed,
    mass,
    minimumMass,
    maximumMass,
    emitterType,
    param1,
    param2,
    enableBurst,
    burstTime,
    burstMin,
    burstMax,
    useModelMatrix,
    modelLng,
    modelLat,
    modelHeight,
    useEmitterModelMatrix,
    emitterOffsetX,
    emitterOffsetY,
    emitterOffsetZ,
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

  const modelMatrixValue = useMemo(() => {
    if (!useModelMatrix) return undefined
    const center = Cesium.Cartesian3.fromDegrees(modelLng, modelLat, modelHeight)
    return Cesium.Transforms.eastNorthUpToFixedFrame(center)
  }, [useModelMatrix, modelLng, modelLat, modelHeight])

  const emitterModelMatrixValue = useMemo(() => {
    if (!useEmitterModelMatrix) return undefined
    return Cesium.Matrix4.fromTranslation(
      new Cesium.Cartesian3(emitterOffsetX, emitterOffsetY, emitterOffsetZ)
    )
  }, [useEmitterModelMatrix, emitterOffsetX, emitterOffsetY, emitterOffsetZ])

  const bursts = useMemo(() => {
    if (!enableBurst) return undefined
    return [new Cesium.ParticleBurst({ time: burstTime, minimum: burstMin, maximum: burstMax })]
  }, [enableBurst, burstTime, burstMin, burstMax])

  const imageSize = useMemo(
    () => new Cesium.Cartesian2(imageWidth, imageHeight),
    [imageWidth, imageHeight]
  )

  const minimumImageSize = useMemo(
    () => new Cesium.Cartesian2(minImageWidth, minImageHeight),
    [minImageWidth, minImageHeight]
  )

  const maximumImageSize = useMemo(
    () => new Cesium.Cartesian2(maxImageWidth, maxImageHeight),
    [maxImageWidth, maxImageHeight]
  )

  /**
   * 粒子属性
   */
  const particleProps = useMemo(
    () => ({
      image: defaultImage,
      startColor: Cesium.Color.fromCssColorString(startColor).withAlpha(startAlpha),
      endColor: Cesium.Color.fromCssColorString(endColor).withAlpha(endAlpha),
      startScale,
      endScale,
      imageSize,
      minimumImageSize,
      maximumImageSize,
      minimumParticleLife,
      maximumParticleLife,
      particleLife: particleLife > 0 ? particleLife : undefined,
      speed: speed > 0 ? speed : undefined,
      minimumSpeed,
      maximumSpeed,
      mass: mass > 0 ? mass : undefined,
      minimumMass,
      maximumMass,
      emissionRate,
      lifetime: lifetime === 0 ? Number.POSITIVE_INFINITY : lifetime,
      loop,
      sizeInMeters,
      bursts,
    }),
    [
      defaultImage,
      startColor,
      endColor,
      startAlpha,
      endAlpha,
      startScale,
      endScale,
      imageSize,
      minimumImageSize,
      maximumImageSize,
      minimumParticleLife,
      maximumParticleLife,
      particleLife,
      speed,
      minimumSpeed,
      maximumSpeed,
      mass,
      minimumMass,
      maximumMass,
      emissionRate,
      lifetime,
      loop,
      sizeInMeters,
      bursts,
    ],
  )

  return (
    <ParticleSystem
      {...props}
      {...particleProps}
      show={show}
      emitter={emitter}
      modelMatrix={modelMatrixValue}
      emitterModelMatrix={emitterModelMatrixValue}
    />
  )
}

export default memo(ParticleSystemWithLeva)
