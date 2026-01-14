import { memo, useMemo } from "react"
import { Scene, type SceneProps } from "resium"
import { Cartesian3, Color, DirectionalLight, SceneMode } from "cesium"
import { folder } from "leva"
import useLevaControls from "@/hooks/useLevaControls"

type SceneWithLevaProps = Omit<
  SceneProps,
  "light" | "mode" | "morphDuration" | "debugShowFramesPerSecond" | "debugShowFrustumPlanes" | "debugShowDepthFrustum" | "debugShowCommands" | "debugShowFrustums" | "backgroundColor" | "completeMorphOnUserInput" | "highDynamicRange" | "invertClassification" | "invertClassificationColor" | "logarithmicDepthBuffer" | "pickTranslucentDepth" | "requestRenderMode" | "rethrowRenderErrors" | "useDepthPicking" | "useWebVR" | "sunBloom" | "eyeSeparation" | "farToNearRatio" | "focalLength" | "gamma" | "logarithmicDepthFarToNearRatio" | "maximumRenderTimeChange" | "minimumDisableDepthTestDistance" | "morphTime" | "nearToFarDistance2D" | "splitPosition" | "msaaSamples" | "verticalExaggeration" | "verticalExaggerationRelativeHeight"
> & {
  enableDebug?: boolean
}

const SceneWithLeva = ({ enableDebug = false, ...props }: SceneWithLevaProps) => {
  // 灯光调试参数
  const lightParams = useLevaControls({
    name: "Scene",
    schema: {
      light: folder({
        useCustomLight: { label: "light【灯光】", value: true },
        direction: {
          label: "direction【方向】",
          value: {
            x: 0.35492591601301104,
            y: -0.8909182691839401,
            z: -0.2833588392420772,
          },
          step: 0.1,
        },
        color: {
          label: "color【颜色】",
          value: {
            r: 255,
            g: 255,
            b: 255,
            a: 1,
          },
        },
        intensity: {
          label: "intensity【强度】",
          value: 1.25,
          step: 0.1,
        },
      }),
    },
    folderSettings: { collapsed: !enableDebug },
  })

  const light = useMemo(() => {
    if (!lightParams.useCustomLight) return undefined
    const { x, y, z } = lightParams.direction
    const { r, g, b, a } = lightParams.color

    return new DirectionalLight({
      direction: new Cartesian3(x, y, z),
      color: new Color(r / 255, g / 255, b / 255, a),
      intensity: lightParams.intensity,
    })
  }, [lightParams])

  // 场景调试参数
  const sceneParams = useLevaControls({
    name: "Scene",
    schema: {
      mode: {
        label: "mode【模式】",
        value: SceneMode.SCENE3D,
        options: {
          SCENE3D: SceneMode.SCENE3D,
          SCENE2D: SceneMode.SCENE2D,
          COLUMBUS_VIEW: SceneMode.COLUMBUS_VIEW,
        },
      },
      morphDuration: { label: "morphDuration【变形时长】", value: 2, min: 0, step: 0.1 },
      debugShowFramesPerSecond: {
        label: "debugShowFramesPerSecond【显示帧率】",
        value: true,
      },
      debugShowFrustumPlanes: {
        label: "debugShowFrustumPlanes【显示摄像机的视锥体】",
        value: false,
      },
      debugShowDepthFrustum: {
        label: "debugShowDepthFrustum【深度视椎调试】",
        value: 0,
        min: 0,
        step: 1,
      },
      debugShowCommands: {
        label: "debugShowCommands【显示命令】",
        value: false,
      },
      debugShowFrustums: {
        label: "debugShowFrustums【显示视锥体可视范围】",
        value: false,
      },
      completeMorphOnUserInput: {
        label: "completeMorphOnUserInput【用户输入完成变形】",
        value: true,
      },
      highDynamicRange: { label: "highDynamicRange【高动态范围】", value: true },
      invertClassification: { label: "invertClassification【反转分类】", value: false },
      invertClassificationColor: { label: "invertClassificationColor【反转分类颜色】", value: "#ffffff" },
      logarithmicDepthBuffer: { label: "logarithmicDepthBuffer【对数深度缓冲】", value: false },
      pickTranslucentDepth: { label: "pickTranslucentDepth【拾取半透明深度】", value: false },
      requestRenderMode: { label: "requestRenderMode【请求渲染模式】", value: false },
      rethrowRenderErrors: { label: "rethrowRenderErrors【重新抛出渲染错误】", value: false },
      useDepthPicking: { label: "useDepthPicking【使用深度拾取】", value: true },
      useWebVR: { label: "useWebVR【启用 WebVR】", value: false },
      sunBloom: { label: "sunBloom【太阳泛光】", value: false },
      eyeSeparation: { label: "eyeSeparation【眼间距】", value: 0.025, min: 0, step: 0.001 },
      farToNearRatio: { label: "farToNearRatio【远近比】", value: 1000, min: 0, step: 1 },
      focalLength: { label: "focalLength【焦距】", value: 1, min: 0, step: 0.01 },
      gamma: { label: "gamma【伽马】", value: 1, min: 0, step: 0.01 },
      logarithmicDepthFarToNearRatio: { label: "logarithmicDepthFarToNearRatio【对数深度远近比】", value: 1e9, min: 0, step: 1 },
      maximumRenderTimeChange: { label: "maximumRenderTimeChange【最大渲染时间变化】", value: 0, min: 0, step: 0.1 },
      minimumDisableDepthTestDistance: { label: "minimumDisableDepthTestDistance【最小禁用深度距离】", value: 0, min: 0, step: 1 },
      morphTime: { label: "morphTime【变形时间】", value: 1, min: 0, max: 1, step: 0.01 },
      nearToFarDistance2D: { label: "nearToFarDistance2D【2D 近远距离】", value: 1.0e9, min: 0, step: 1 },
      splitPosition: { label: "splitPosition【分割位置】", value: 0.5, min: 0, max: 1, step: 0.01 },
      msaaSamples: { label: "msaaSamples【MSAA 样本数】", value: 1, min: 1, max: 8, step: 1 },
      verticalExaggeration: { label: "verticalExaggeration【垂直夸张】", value: 1, min: 0, step: 0.1 },
      verticalExaggerationRelativeHeight: { label: "verticalExaggerationRelativeHeight【垂直夸张相对高度】", value: 0, step: 1 },
      backgroundColor: { label: "backgroundColor【背景色】", value: "#000000" },
    },
    folderSettings: { collapsed: !enableDebug },
  })

  const useWebVr = sceneParams.useWebVR ? (true as const) : undefined

  // Complex Scene props (fog, globe, skyBox, postProcessStages, etc.) remain passthrough-only.
  return (
    <Scene
      {...props}
      light={light}
      mode={sceneParams.mode}
      morphDuration={sceneParams.morphDuration}
      debugShowCommands={sceneParams.debugShowCommands}
      debugShowFramesPerSecond={sceneParams.debugShowFramesPerSecond}
      debugShowDepthFrustum={sceneParams.debugShowDepthFrustum}
      debugShowFrustumPlanes={sceneParams.debugShowFrustumPlanes}
      debugShowFrustums={sceneParams.debugShowFrustums}
      completeMorphOnUserInput={sceneParams.completeMorphOnUserInput}
      highDynamicRange={sceneParams.highDynamicRange}
      invertClassification={sceneParams.invertClassification}
      invertClassificationColor={Color.fromCssColorString(sceneParams.invertClassificationColor)}
      logarithmicDepthBuffer={sceneParams.logarithmicDepthBuffer}
      pickTranslucentDepth={sceneParams.pickTranslucentDepth}
      requestRenderMode={sceneParams.requestRenderMode}
      rethrowRenderErrors={sceneParams.rethrowRenderErrors}
      useDepthPicking={sceneParams.useDepthPicking}
      useWebVR={useWebVr}
      sunBloom={sceneParams.sunBloom}
      eyeSeparation={sceneParams.eyeSeparation}
      farToNearRatio={sceneParams.farToNearRatio}
      focalLength={sceneParams.focalLength}
      gamma={sceneParams.gamma}
      logarithmicDepthFarToNearRatio={sceneParams.logarithmicDepthFarToNearRatio}
      maximumRenderTimeChange={sceneParams.maximumRenderTimeChange}
      minimumDisableDepthTestDistance={sceneParams.minimumDisableDepthTestDistance}
      morphTime={sceneParams.morphTime}
      nearToFarDistance2D={sceneParams.nearToFarDistance2D}
      splitPosition={sceneParams.splitPosition}
      msaaSamples={sceneParams.msaaSamples}
      verticalExaggeration={sceneParams.verticalExaggeration}
      verticalExaggerationRelativeHeight={sceneParams.verticalExaggerationRelativeHeight}
      backgroundColor={Color.fromCssColorString(sceneParams.backgroundColor)}
    />
  )
}

export default memo(SceneWithLeva)
