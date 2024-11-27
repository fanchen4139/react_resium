import * as Cesium from "cesium";
import { folder } from "leva";
import { memo, useMemo, type FC } from "react";
import { Entity, WallGraphics } from "resium";
import useLevaControls from "../../../hooks/useLevaControls";
import WallMaterialProperty from "../../../materials/property/WallMaterialProperty.js";
import type { DefaultControllerProps, PartialWithout } from "../../../types/Common";
import { GCJ02_2_WGS84 } from "../../../utils/coordinate";
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
const WallDemo: WallPrimitiveType = ({
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
  const params = useLevaControls(
    {
      name: `Wall_${controllerName}`,
      schema: { // 控制面板配置
        wall: folder({
          minimumHeight: {
            label: 'minimumHeight【最小高度】',
            value: 0,
            step: 1,
          },
          maximumHeight: {
            label: 'maximumHeight【最大高度】',
            value: 100,
            step: 1,
          },
          outlineColor: {
            label: 'outlineColor【边框线颜色】',
            value: {
              r: 0,
              g: 255,
              b: 255,
              a: 1
            }
          },
          outlineWidth: {
            label: 'outlineWidth【边框线宽度】',
            value: 1,
            step: 1
          },
          outline: {
            label: 'outline【是否显示边框线】',
            value: false
          },
        }),
      },
      folderSettings: {
        collapsed: false
      }
    },
    enableDebug
  )

  const materialParams = useLevaControls(
    {
      name: `Wall_${controllerName}`,
      schema: { // 控制面板配置
        material: folder({
          speed: {
            label: 'speed【贴图动画执行速度】',
            value: 1.0,
            step: 0.1,
            min: 0.1,
          },
          repeat: {
            label: 'repeat【贴图重复次数】',
            value: 1.0,
            step: 0.1,
            min: 1,
          },
          color: {
            label: 'color【贴图叠加颜色】',
            value: {
              r: 0,
              g: 255,
              b: 255,
              a: 1
            }
          },
        })
      },
      folderSettings: {
        collapsed: false
      }
    },
    enableDebug
  )

  // 墙体边框线颜色
  const outlineColor = useMemo(() => {
    let { r, g, b, a } = params.outlineColor
    r /= 255
    g /= 255
    b /= 255
    return new Cesium.Color(r, g, b, a)
  }, [params.outlineColor])

  // 处理坐标
  const degreesArray = polygonHierarchy.reduce((pre, cur) => {
    if (enableTransformCoordinate) {
      pre.push(...GCJ02_2_WGS84(cur[0], cur[1]))
    } else {
      pre.push(cur[0], cur[1])
    }
    return pre
  }, [])

  // 墙体最大高度
  const maximumHeights = useMemo(() => polygonHierarchy.map(item => params.maximumHeight), [params.maximumHeight])
  // 墙体最小高度
  const minimumHeights = useMemo(() => polygonHierarchy.map(item => params.minimumHeight), [params.minimumHeight])
  // 墙体贴图
  const material = useMemo(() => {
    let { r, g, b, a } = materialParams.color
    r /= 255
    g /= 255
    b /= 255
    return new WallMaterialProperty({
      speed: materialParams.speed,
      color: new Cesium.Color(r, g, b, a),
      repeat: materialParams.repeat
    })
  }, [materialParams.repeat, materialParams.speed, materialParams.color])

  return (
    <Entity position={Cesium.Cartesian3.fromDegrees(116.386378, 39.920743, 0)} >
      <WallGraphics
        outline={params.outline}
        outlineWidth={params.outlineWidth}
        outlineColor={outlineColor}
        maximumHeights={maximumHeights}
        minimumHeights={minimumHeights}
        positions={Cesium.Cartesian3.fromDegreesArray(degreesArray)}
        material={material}
      />
    </Entity>
  )
}

export default memo(WallDemo)