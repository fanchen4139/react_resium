import { Scene } from "resium"
import useLevaControls from "../../hooks/useLevaControls"
import { folder } from "leva"
import { memo, useMemo } from "react"
import { Cartesian3, Color, DirectionalLight } from "cesium"

const SceneWithLeva = ({ enableDebug = false }) => {

  // 灯光调试参数
  const lightParams = useLevaControls({
    name: 'Scene',
    schema: {
      light: folder({
        direction: {
          label: 'direction【方向】',
          value: {
            x: 4,
            y: -4,
            z: 2
          },
          step: 0.1
        },
        color: {
          label: 'color【颜色】',
          value: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
          }
        },
        intensity: {
          label: 'intensity【强度】',
          value: 5,
          step: 0.1
        },
      })
    }
  }, enableDebug)

  const light = useMemo(() => {
    const { x, y, z } = lightParams.direction
    let { r, g, b, a } = lightParams.color
    r /= 255
    g /= 255
    b /= 255

    return new DirectionalLight({
      direction: new Cartesian3(x, y, z),
      color: new Color(r, g, b, a),
      intensity: lightParams.intensity
    })
  }, [lightParams])


  // 场景调试参数
  const sceneParams = useLevaControls({
    name: 'Scene',
    schema: {
      debugShowFramesPerSecond: {
        label: 'debugShowFramesPerSecond【显示帧率】',
        value: true
      },
      debugShowFrustumPlanes: {
        label: 'debugShowFrustumPlanes【显示摄像机的视锥体】',
        value: false
      },
      debugShowCommands: {
        label: 'debugShowCommands【显示命令】',
        value: false
      },
      debugShowFrustums: {
        label: 'debugShowFrustums【显示视锥体可视范围】',
        value: false
      },
    }
  }, enableDebug)

  return (
    <Scene
      light={light}
      debugShowCommands={sceneParams.debugShowCommands}
      // debugShowDepthFrustum
      debugShowFramesPerSecond={sceneParams.debugShowFramesPerSecond}
      debugShowFrustumPlanes={sceneParams.debugShowFrustumPlanes}
      debugShowFrustums={sceneParams.debugShowFrustums}
      backgroundColor={Color.BLACK}
    />
  )
}

export default memo(SceneWithLeva)
