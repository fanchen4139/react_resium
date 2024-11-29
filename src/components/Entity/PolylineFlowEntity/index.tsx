import Colors1 from "@/assets/images/colors1.png";
import PolylineFlowMaterialProperty from "@/engine/Source/DataSource/PolylineFlowMaterialProperty.js";
import * as Cesium from "cesium";
import { Color } from "cesium";
import { memo, type FC } from "react";
import { Entity, PolylineGraphics } from "resium";
import useLevaControls from "../../../hooks/useLevaControls";
import type { DefaultControllerProps, PartialWithout } from "../../../types/Common";
import { GCJ02_2_WGS84 } from "../../../utils/coordinate";
type PolylineFlowType = FC<{
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
const PolylineFlowEntity: PolylineFlowType = ({
  controllerName = '',
  enableDebug = false,
  enableTransformCoordinate = false,
  polygonHierarchy = [
    [
      116.367865,
      39.905709
    ],
    [
      116.368088,
      39.898215
    ],
    [
      116.377879,
      39.898421
    ],
    [
      116.412125,
      39.89953
    ],
    [
      116.412593,
      39.892385
    ],
    [
      116.40622,
      39.891804
    ],
    [
      116.406213,
      39.887202
    ],
    [
      116.399286,
      39.886663
    ],
    [
      116.392704,
      39.88485
    ],
    [
      116.378891,
      39.885081
    ],
    [
      116.378552,
      39.88791
    ],
    [
      116.368433,
      39.887971
    ],
    [
      116.368468,
      39.897686
    ]
  ] }) => {

  // 获取控制面板参数
  const params = useLevaControls(
    {
      name: `PolylineFlow_${controllerName}`,
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
      pre.push(...GCJ02_2_WGS84(cur[0], cur[1]), 10)
    } else {
      pre.push(cur[0], cur[1], 10)
    }
    return pre
  }, [])


  return (
    <Entity position={Cesium.Cartesian3.fromDegrees(116.386378, 39.920743, 0)} >
      <PolylineGraphics
        positions={Cesium.Cartesian3.fromDegreesArrayHeights(degreesArray)}
        width={15}
        material={
          // new Cesium.PolylineGlowMaterialProperty({
          //   glowPower: 0.1,
          //   color: Cesium.Color.fromCssColorString('#ff0000')
          // })
          // new Cesium.PolylineGlowMaterialProperty({ glowPower: .1 })
          new PolylineFlowMaterialProperty(
            { image: Colors1, color: Color.BLUEVIOLET, repeat: new Cesium.Cartesian2(10.0, 1.0) }
          )
        }
        clampToGround={true}
      />
    </Entity>
  )
}


export default memo(PolylineFlowEntity)