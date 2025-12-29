import { memo, useMemo } from "react"
import { Scene } from "resium"
import { Cartesian3, Color, DirectionalLight } from "cesium"
import { folder } from "leva"
import useLevaControls from "@/hooks/useLevaControls"

type SceneWithLevaProps = {
  enableDebug?: boolean
}

const SceneWithLeva = ({ enableDebug = false }: SceneWithLevaProps) => {
  // 灯光调试参数
  const lightParams = useLevaControls({
    name: "Scene",
    schema: {
      light: folder({
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
  }, true)

  const light = useMemo(() => {
    const { x, y, z } = lightParams.direction
    let { r, g, b, a } = lightParams.color
    r /= 255
    g /= 255
    b /= 255

    return new DirectionalLight({
      direction: new Cartesian3(x, y, z),
      color: new Color(r, g, b, a),
      intensity: lightParams.intensity,
    })
  }, [lightParams])

  // 场景调试参数
  const sceneParams = useLevaControls({
    name: "Scene",
    schema: {
      debugShowFramesPerSecond: {
        label: "debugShowFramesPerSecond【显示帧率】",
        value: true,
      },
      debugShowFrustumPlanes: {
        label: "debugShowFrustumPlanes【显示摄像机的视锥体】",
        value: false,
      },
      debugShowCommands: {
        label: "debugShowCommands【显示命令】",
        value: false,
      },
      debugShowFrustums: {
        label: "debugShowFrustums【显示视锥体可视范围】",
        value: false,
      },
    },
  }, enableDebug)

  return (
    <Scene
      light={light}
      debugShowCommands={sceneParams.debugShowCommands}
      debugShowFramesPerSecond={sceneParams.debugShowFramesPerSecond}
      debugShowFrustumPlanes={sceneParams.debugShowFrustumPlanes}
      debugShowFrustums={sceneParams.debugShowFrustums}
      backgroundColor={Color.BLACK}
    />
  )
}

export default memo(SceneWithLeva)


