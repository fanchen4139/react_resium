import { memo, useMemo } from "react"
import { Scene, type SceneProps } from "resium"
import { Cartesian3, Color, DirectionalLight, SceneMode } from "cesium"
import { folder } from "leva"
import useLevaControls from "@/hooks/useLevaControls"
import type { Schema } from "leva/dist/declarations/src/types"

/**
 * Props for SceneWithLeva.
 * - Accepts partial SceneProps to enable opt-in Leva controls per prop.
 * - Allows color props as Color or CSS string for convenience.
 */
type SceneWithLevaProps = Omit<
  Partial<SceneProps>,
  "backgroundColor" | "invertClassificationColor"
> & {
  backgroundColor?: Color | string
  invertClassificationColor?: Color | string
}

/**
 * Leva control values inferred from the dynamic schema.
 * All fields are optional because controls are created only for provided props.
 */
type SceneLevaParams = {
  useCustomLight?: boolean
  direction?: { x: number; y: number; z: number }
  color?: { r: number; g: number; b: number; a: number }
  intensity?: number
  mode?: SceneMode
  morphDuration?: number
  debugShowFramesPerSecond?: boolean
  debugShowFrustumPlanes?: boolean
  debugShowDepthFrustum?: number
  debugShowCommands?: boolean
  debugShowFrustums?: boolean
  completeMorphOnUserInput?: boolean
  highDynamicRange?: boolean
  invertClassification?: boolean
  invertClassificationColor?: string
  logarithmicDepthBuffer?: boolean
  pickTranslucentDepth?: boolean
  requestRenderMode?: boolean
  rethrowRenderErrors?: boolean
  useDepthPicking?: boolean
  useWebVR?: boolean
  sunBloom?: boolean
  eyeSeparation?: number
  farToNearRatio?: number
  focalLength?: number
  gamma?: number
  logarithmicDepthFarToNearRatio?: number
  maximumRenderTimeChange?: number
  minimumDisableDepthTestDistance?: number
  morphTime?: number
  nearToFarDistance2D?: number
  splitPosition?: number
  msaaSamples?: number
  verticalExaggeration?: number
  verticalExaggerationRelativeHeight?: number
  backgroundColor?: string
}

const SceneWithLeva = ({ ...props }: SceneWithLevaProps) => {
  const {
    light,
    mode,
    morphDuration,
    debugShowFramesPerSecond,
    debugShowFrustumPlanes,
    debugShowDepthFrustum,
    debugShowCommands,
    debugShowFrustums,
    completeMorphOnUserInput,
    highDynamicRange,
    invertClassification,
    invertClassificationColor,
    logarithmicDepthBuffer,
    pickTranslucentDepth,
    requestRenderMode,
    rethrowRenderErrors,
    useDepthPicking,
    useWebVR,
    sunBloom,
    eyeSeparation,
    farToNearRatio,
    focalLength,
    gamma,
    logarithmicDepthFarToNearRatio,
    maximumRenderTimeChange,
    minimumDisableDepthTestDistance,
    morphTime,
    nearToFarDistance2D,
    splitPosition,
    msaaSamples,
    verticalExaggeration,
    verticalExaggerationRelativeHeight,
    backgroundColor,
  } = props

  const toCssColorString = (value?: Color | string) =>
    value instanceof Color ? value.toCssColorString() : value

  const schema: Schema = {}
  const lightSchema: Schema = {}
  const sceneSchema: Schema = {}

  if (light !== undefined) {
    const defaultDirection = new Cartesian3(
      0.35492591601301104,
      -0.8909182691839401,
      -0.2833588392420772
    )
    const lightDirection =
      light instanceof DirectionalLight ? light.direction : defaultDirection
    const lightColor =
      light instanceof DirectionalLight ? light.color : Color.WHITE
    const lightIntensity =
      light instanceof DirectionalLight ? light.intensity : 1.25

    lightSchema.useCustomLight = {
      label: "light【灯光】",
      value: light instanceof DirectionalLight,
    }
    lightSchema.direction = {
      label: "direction【方向】",
      value: {
        x: lightDirection.x,
        y: lightDirection.y,
        z: lightDirection.z,
      },
      step: 0.1,
    }
    lightSchema.color = {
      label: "color【颜色】",
      value: {
        r: Math.round(lightColor.red * 255),
        g: Math.round(lightColor.green * 255),
        b: Math.round(lightColor.blue * 255),
        a: lightColor.alpha,
      },
    }
    lightSchema.intensity = {
      label: "intensity【强度】",
      value: lightIntensity,
      step: 0.1,
      min: 0,
      max: 1
    }
  }

  if (Object.keys(lightSchema).length > 0) {
    schema.light = folder(lightSchema, { collapsed: false })
  }

  if (mode !== undefined) {
    sceneSchema.mode = {
      label: "mode【模式】",
      value: mode,
      options: {
        SCENE3D: SceneMode.SCENE3D,
        SCENE2D: SceneMode.SCENE2D,
        COLUMBUS_VIEW: SceneMode.COLUMBUS_VIEW,
      },
    }
  }
  if (morphDuration !== undefined) {
    sceneSchema.morphDuration = {
      label: "morphDuration【变形时长】",
      value: morphDuration,
      min: 0,
      step: 0.1,
    }
  }
  if (debugShowFramesPerSecond !== undefined) {
    sceneSchema.debugShowFramesPerSecond = {
      label: "debugShowFramesPerSecond【显示帧率】",
      value: debugShowFramesPerSecond,
    }
  }
  if (debugShowFrustumPlanes !== undefined) {
    sceneSchema.debugShowFrustumPlanes = {
      label: "debugShowFrustumPlanes【显示摄像机的视锥体】",
      value: debugShowFrustumPlanes,
    }
  }
  if (debugShowDepthFrustum !== undefined) {
    sceneSchema.debugShowDepthFrustum = {
      label: "debugShowDepthFrustum【深度视椎调试】",
      value: debugShowDepthFrustum,
      min: 0,
      step: 1,
    }
  }
  if (debugShowCommands !== undefined) {
    sceneSchema.debugShowCommands = {
      label: "debugShowCommands【显示命令】",
      value: debugShowCommands,
    }
  }
  if (debugShowFrustums !== undefined) {
    sceneSchema.debugShowFrustums = {
      label: "debugShowFrustums【显示视锥体可视范围】",
      value: debugShowFrustums,
    }
  }
  if (completeMorphOnUserInput !== undefined) {
    sceneSchema.completeMorphOnUserInput = {
      label: "completeMorphOnUserInput【用户输入完成变形】",
      value: completeMorphOnUserInput,
    }
  }
  if (highDynamicRange !== undefined) {
    sceneSchema.highDynamicRange = {
      label: "highDynamicRange【高动态范围】",
      value: highDynamicRange,
    }
  }
  if (invertClassification !== undefined) {
    sceneSchema.invertClassification = {
      label: "invertClassification【反转分类】",
      value: invertClassification,
    }
  }
  if (invertClassificationColor !== undefined) {
    sceneSchema.invertClassificationColor = {
      label: "invertClassificationColor【反转分类颜色】",
      value: toCssColorString(invertClassificationColor),
    }
  }
  if (logarithmicDepthBuffer !== undefined) {
    sceneSchema.logarithmicDepthBuffer = {
      label: "logarithmicDepthBuffer【对数深度缓冲】",
      value: logarithmicDepthBuffer,
    }
  }
  if (pickTranslucentDepth !== undefined) {
    sceneSchema.pickTranslucentDepth = {
      label: "pickTranslucentDepth【拾取半透明深度】",
      value: pickTranslucentDepth,
    }
  }
  if (requestRenderMode !== undefined) {
    sceneSchema.requestRenderMode = {
      label: "requestRenderMode【请求渲染模式】",
      value: requestRenderMode,
    }
  }
  if (rethrowRenderErrors !== undefined) {
    sceneSchema.rethrowRenderErrors = {
      label: "rethrowRenderErrors【重新抛出渲染错误】",
      value: rethrowRenderErrors,
    }
  }
  if (useDepthPicking !== undefined) {
    sceneSchema.useDepthPicking = {
      label: "useDepthPicking【使用深度拾取】",
      value: useDepthPicking,
    }
  }
  if (useWebVR !== undefined) {
    sceneSchema.useWebVR = {
      label: "useWebVR【启用 WebVR】",
      value: useWebVR,
    }
  }
  if (sunBloom !== undefined) {
    sceneSchema.sunBloom = {
      label: "sunBloom【太阳泛光】",
      value: sunBloom,
    }
  }
  if (eyeSeparation !== undefined) {
    sceneSchema.eyeSeparation = {
      label: "eyeSeparation【眼间距】",
      value: eyeSeparation,
      min: 0,
      step: 0.001,
    }
  }
  if (farToNearRatio !== undefined) {
    sceneSchema.farToNearRatio = {
      label: "farToNearRatio【远近比】",
      value: farToNearRatio,
      min: 0,
      step: 1,
    }
  }
  if (focalLength !== undefined) {
    sceneSchema.focalLength = {
      label: "focalLength【焦距】",
      value: focalLength,
      min: 0,
      step: 0.01,
    }
  }
  if (gamma !== undefined) {
    sceneSchema.gamma = {
      label: "gamma【伽马】",
      value: gamma,
      min: 0,
      step: 0.01,
    }
  }
  if (logarithmicDepthFarToNearRatio !== undefined) {
    sceneSchema.logarithmicDepthFarToNearRatio = {
      label: "logarithmicDepthFarToNearRatio【对数深度远近比】",
      value: logarithmicDepthFarToNearRatio,
      min: 0,
      step: 1,
    }
  }
  if (maximumRenderTimeChange !== undefined) {
    sceneSchema.maximumRenderTimeChange = {
      label: "maximumRenderTimeChange【最大渲染时间变化】",
      value: maximumRenderTimeChange,
      min: 0,
      step: 0.1,
    }
  }
  if (minimumDisableDepthTestDistance !== undefined) {
    sceneSchema.minimumDisableDepthTestDistance = {
      label: "minimumDisableDepthTestDistance【最小禁用深度距离】",
      value: minimumDisableDepthTestDistance,
      min: 0,
      step: 1,
    }
  }
  if (morphTime !== undefined) {
    sceneSchema.morphTime = {
      label: "morphTime【变形时间】",
      value: morphTime,
      min: 0,
      max: 1,
      step: 0.01,
    }
  }
  if (nearToFarDistance2D !== undefined) {
    sceneSchema.nearToFarDistance2D = {
      label: "nearToFarDistance2D【2D 近远距离】",
      value: nearToFarDistance2D,
      min: 0,
      step: 1,
    }
  }
  if (splitPosition !== undefined) {
    sceneSchema.splitPosition = {
      label: "splitPosition【分割位置】",
      value: splitPosition,
      min: 0,
      max: 1,
      step: 0.01,
    }
  }
  if (msaaSamples !== undefined) {
    sceneSchema.msaaSamples = {
      label: "msaaSamples【MSAA 样本数】",
      value: msaaSamples,
      min: 1,
      max: 8,
      step: 1,
    }
  }
  if (verticalExaggeration !== undefined) {
    sceneSchema.verticalExaggeration = {
      label: "verticalExaggeration【垂直夸张】",
      value: verticalExaggeration,
      min: 0,
      step: 0.1,
    }
  }
  if (verticalExaggerationRelativeHeight !== undefined) {
    sceneSchema.verticalExaggerationRelativeHeight = {
      label: "verticalExaggerationRelativeHeight【垂直夸张相对高度】",
      value: verticalExaggerationRelativeHeight,
      step: 1,
    }
  }
  if (backgroundColor !== undefined) {
    sceneSchema.backgroundColor = {
      label: "backgroundColor【背景色】",
      value: toCssColorString(backgroundColor),
    }
  }

  if (Object.keys(sceneSchema).length > 0) {
    schema.scene = folder(sceneSchema, { collapsed: false })
  }

  const params = useLevaControls({
    name: "Scene",
    schema,
  }) as SceneLevaParams

  const hasLightControls = Object.keys(lightSchema).length > 0
  const lightValue = useMemo(() => {
    if (!hasLightControls) return light
    if (!params.useCustomLight) return light
    if (!params.direction || !params.color || params.intensity === undefined) {
      return light
    }
    const { x, y, z } = params.direction
    const { r, g, b, a } = params.color
    return new DirectionalLight({
      direction: new Cartesian3(x, y, z),
      color: new Color(r / 255, g / 255, b / 255, a),
      intensity: params.intensity,
    })
  }, [hasLightControls, light, params])

  const useWebVr = params.useWebVR ? (true as const) : undefined

  // Complex Scene props (fog, globe, skyBox, postProcessStages, etc.) remain passthrough-only.
  const {
    backgroundColor: backgroundColorProp,
    invertClassificationColor: invertClassificationColorProp,
    ...restProps
  } = props
  const sceneProps: SceneProps = { ...(restProps as SceneProps) }

  if (light !== undefined) {
    sceneProps.light = lightValue
  }
  if (mode !== undefined) {
    sceneProps.mode = params.mode
  }
  if (morphDuration !== undefined) {
    sceneProps.morphDuration = params.morphDuration
  }
  if (debugShowFramesPerSecond !== undefined) {
    sceneProps.debugShowFramesPerSecond = params.debugShowFramesPerSecond
  }
  if (debugShowFrustumPlanes !== undefined) {
    sceneProps.debugShowFrustumPlanes = params.debugShowFrustumPlanes
  }
  if (debugShowDepthFrustum !== undefined) {
    sceneProps.debugShowDepthFrustum = params.debugShowDepthFrustum
  }
  if (debugShowCommands !== undefined) {
    sceneProps.debugShowCommands = params.debugShowCommands
  }
  if (debugShowFrustums !== undefined) {
    sceneProps.debugShowFrustums = params.debugShowFrustums
  }
  if (completeMorphOnUserInput !== undefined) {
    sceneProps.completeMorphOnUserInput = params.completeMorphOnUserInput
  }
  if (highDynamicRange !== undefined) {
    sceneProps.highDynamicRange = params.highDynamicRange
  }
  if (invertClassification !== undefined) {
    sceneProps.invertClassification = params.invertClassification
  }
  if (invertClassificationColorProp !== undefined) {
    sceneProps.invertClassificationColor = Color.fromCssColorString(
      params.invertClassificationColor
    )
  }
  if (logarithmicDepthBuffer !== undefined) {
    sceneProps.logarithmicDepthBuffer = params.logarithmicDepthBuffer
  }
  if (pickTranslucentDepth !== undefined) {
    sceneProps.pickTranslucentDepth = params.pickTranslucentDepth
  }
  if (requestRenderMode !== undefined) {
    sceneProps.requestRenderMode = params.requestRenderMode
  }
  if (rethrowRenderErrors !== undefined) {
    sceneProps.rethrowRenderErrors = params.rethrowRenderErrors
  }
  if (useDepthPicking !== undefined) {
    sceneProps.useDepthPicking = params.useDepthPicking
  }
  if (useWebVR !== undefined) {
    sceneProps.useWebVR = useWebVr
  }
  if (sunBloom !== undefined) {
    sceneProps.sunBloom = params.sunBloom
  }
  if (eyeSeparation !== undefined) {
    sceneProps.eyeSeparation = params.eyeSeparation
  }
  if (farToNearRatio !== undefined) {
    sceneProps.farToNearRatio = params.farToNearRatio
  }
  if (focalLength !== undefined) {
    sceneProps.focalLength = params.focalLength
  }
  if (gamma !== undefined) {
    sceneProps.gamma = params.gamma
  }
  if (logarithmicDepthFarToNearRatio !== undefined) {
    sceneProps.logarithmicDepthFarToNearRatio =
      params.logarithmicDepthFarToNearRatio
  }
  if (maximumRenderTimeChange !== undefined) {
    sceneProps.maximumRenderTimeChange = params.maximumRenderTimeChange
  }
  if (minimumDisableDepthTestDistance !== undefined) {
    sceneProps.minimumDisableDepthTestDistance =
      params.minimumDisableDepthTestDistance
  }
  if (morphTime !== undefined) {
    sceneProps.morphTime = params.morphTime
  }
  if (nearToFarDistance2D !== undefined) {
    sceneProps.nearToFarDistance2D = params.nearToFarDistance2D
  }
  if (splitPosition !== undefined) {
    sceneProps.splitPosition = params.splitPosition
  }
  if (msaaSamples !== undefined) {
    sceneProps.msaaSamples = params.msaaSamples
  }
  if (verticalExaggeration !== undefined) {
    sceneProps.verticalExaggeration = params.verticalExaggeration
  }
  if (verticalExaggerationRelativeHeight !== undefined) {
    sceneProps.verticalExaggerationRelativeHeight =
      params.verticalExaggerationRelativeHeight
  }
  if (backgroundColorProp !== undefined) {
    sceneProps.backgroundColor = Color.fromCssColorString(
      params.backgroundColor
    )
  }

  return (
    <Scene
      // key={`Scene${JSON.stringify(sceneProps)}`}
      {...sceneProps}
    />
  )
}

export default memo(SceneWithLeva)
