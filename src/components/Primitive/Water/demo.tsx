import * as Cesium from "cesium";
import { memo, useMemo, type FC } from "react";
import { Entity, PolygonGraphics, Primitive, WallGraphics } from "resium";
import WaterMaterialProperty from "@/engine/Source/DataSource/WaterMaterialProperty";
import useLevaControls from "../../../hooks/useLevaControls";
import type { DefaultControllerProps, PartialWithout } from "../../../types/Common";
import { GCJ02_2_WGS84 } from "../../../utils/coordinate";
import { buildModuleUrl, Color } from "cesium";
import colors1 from "@/assets/images/colors1.png";
type WallPrimitiveType = FC<{
  enableTransformCoordinate?: boolean
  polygonHierarchy?: Array<number[]>
} & PartialWithout<DefaultControllerProps, 'enableDebug'>
>

/** 
 * @description 创建动态水面
 * @param {Object} props - 配置选项
 * @param {string} [props.controllerName] - 调试器折叠面板 name
 * @param {boolean} [props.enableDebug=false] - 是否启用调试模式
 * @param {PolygonHierarchy} props.polygonHierarchy - 多边形层次结构，定义了多边形的形状
 * @param {boolean} [props.enableTransformCoordinate=true] - 默认使用 GCJ02 高德坐标系, 设为 false 则是 WGS84 谷歌坐标系
 */
const WaterDemo: WallPrimitiveType = ({
  controllerName = '',
  enableDebug = false,
  enableTransformCoordinate = false,
  polygonHierarchy = [
    [116.386378, 39.920743],
    [116.386806, 39.91238],
    [116.395126, 39.912604],
    [116.39469, 39.920937],
    [116.386378, 39.920743],
  ] }) => {

  // 获取控制面板参数
  // 获取控制面板参数
  const params = useLevaControls(
    {
      name: `Water_${controllerName}`,
      schema: { // 控制面板配置
        frequency: {
          label: 'frequency【水浪的波动】',
          value: 40.0,
          step: 1,
        },
        animationSpeed: {
          label: 'animationSpeed【水波振幅】',
          value: 0.003,
          step: 0.001,
        },
        amplitude: {
          label: 'amplitude【水流速度】',
          value: 10,
          step: 1,
        },
        specularIntensity: {
          label: 'specularIntensity【镜面反射强度】',
          value: 0.01,
          step: 0.01,
        },
        baseWaterColor: {
          label: 'baseWaterColor【镜面反射强度】',
          value: {
            r: 63,
            g: 152,
            b: 251,
            a: 1
          },
        },
      },
      folderSettings: {
        collapsed: false
      }
    },
    true
  )

  const material = useMemo(() => {
    let { r, g, b, a } = params.baseWaterColor
    r /= 255
    g /= 255
    b /= 255
    return new WaterMaterialProperty({
      // baseWaterColor: new Color(r, g, b, a),
      normalMap: buildModuleUrl("Assets/Textures/waterNormals.jpg"),
      // specularMap: buildModuleUrl("Assets/Textures/waterNormals.jpg"),
      frequency: params.frequency,
      animationSpeed: params.animationSpeed,
      amplitude: params.amplitude,
      specularIntensity: params.specularIntensity,
    })
  }, [params])

  // 处理坐标
  const degreesArray = polygonHierarchy.reduce((pre, cur) => {
    if (enableTransformCoordinate) {
      pre.push(...GCJ02_2_WGS84(cur[0], cur[1]))
    } else {
      pre.push(cur[0], cur[1])
    }
    return pre
  }, [])


  return (
    <Entity position={Cesium.Cartesian3.fromDegrees(116.386378, 39.920743, 0)} >
      <PolygonGraphics
        hierarchy={Cesium.Cartesian3.fromDegreesArray(degreesArray)} // WORKAROUND
        height={0}
        material={material}
      />
    </Entity>
  )
}


export default memo(WaterDemo)