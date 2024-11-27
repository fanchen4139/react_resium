import * as Cesium from "cesium";
import { memo, useMemo, type FC } from "react";
import { Entity, PolygonGraphics, Primitive, WallGraphics } from "resium";
import WaterMaterialProperty from "../../../materials/property/WaterMaterialProperty.js";
import useLevaControls from "../../../hooks/useLevaControls";
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
  const params = useLevaControls(
    {
      name: `Wall_${controllerName}`,
      schema: { // 控制面板配置
        minimumHeights: {
          label: 'minimumHeights【最小高度】',
          value: 0,
          step: 1,
        },
        maximumHeights: {
          label: 'maximumHeights【最大高度】',
          value: 300,
          step: 1,
        },
        granularity: {
          label: 'granularity【粒度】',
          value: 0.1,
          step: 0.001,
          min: 0.001,
          max: 1
        },
        fill: {
          label: 'fill【是否填满】',
          value: false
        },
      },
      folderSettings: {
        collapsed: false
      }
    },
    enableDebug
  )



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
    <Entity position={Cesium.Cartesian3.fromDegrees(116.386378, 39.920743, 1000)} >
      <PolygonGraphics
        hierarchy={Cesium.Cartesian3.fromDegreesArray(degreesArray)} // WORKAROUND
        height={200}
        material={new WaterMaterialProperty()}
      />
    </Entity>
  )
}


export default memo(WaterDemo)