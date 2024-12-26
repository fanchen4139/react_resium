import Colors1 from "@/assets/images/colors1.png";
import PolylineFlowMaterialProperty from "@/engine/Source/DataSource/PolylineFlowMaterialProperty.js";
import { Cartesian3, Color, Cartesian2, type MaterialProperty } from "cesium";
import { memo, useMemo, type FC } from "react";
import { Entity, PolylineGraphics } from "resium";
import useLevaControls from "../../../hooks/useLevaControls";
import type { DefaultControllerProps, CesiumImage, PartialWithout, RGBA } from "../../../types/Common";
import { GCJ02_2_WGS84 } from "../../../utils/coordinate";
import { folder } from "leva";


interface GraphicsParams {
  width?: number
  height?: number
}
interface MaterialParams {
  image?: CesiumImage
  color?: RGBA
  repeat?: Cartesian2
  speed?: number
}

interface DefaultParams {
  graphics?: GraphicsParams
  material?: MaterialParams
}

type PolylineFlowProps = {
  enableTransformCoordinate?: boolean
  polygonHierarchy?: Array<number[]>
  defaultParams?: DefaultParams
  customMaterial?: Color | MaterialProperty
} & PartialWithout<DefaultControllerProps, 'enableDebug'>

/** 
 * @description 创建动态水面
 * @param {Object} props - 配置选项
 * @param {string} [props.controllerName] - 调试器折叠面板 name
 * @param {boolean} [props.enableDebug=false] - 是否启用调试模式
 * @param {PolygonHierarchy} props.polygonHierarchy - 多边形层次结构，定义了多边形的形状
 * @param {boolean} [props.enableTransformCoordinate] - 默认`true`: GCJ02 高德坐标系, `false`: WGS84 谷歌坐标系
 * @param {DefaultParams} [props.defaultParams] - 默认参数，可调试
 * @param {GraphicsParams} [props.defaultParams.graphics] - Entity 默认参数
 * @param {MaterialParams} [props.defaultParams.material] - Material 默认参数
 */
const PolylineFlowEntity: FC<PolylineFlowProps> = ({
  controllerName = '',
  enableDebug = false,
  enableTransformCoordinate = false,
  polygonHierarchy = [
    [116.367865, 39.905709],
    [116.368088, 39.898215],
    [116.377879, 39.898421],
    [116.412125, 39.89953],
    [116.412593, 39.892385],
    [116.40622, 39.891804],
    [116.406213, 39.887202],
    [116.399286, 39.886663],
    [116.392704, 39.88485],
    [116.378891, 39.885081],
    [116.378552, 39.88791],
    [116.368433, 39.887971],
    [116.368468, 39.897686]
  ],
  defaultParams = {
    graphics: {
      width: 10,
      height: 0,
    },
    material: {
      image: Colors1,
      color: { r: 0, g: 255, b: 255, a: 1 },
      repeat: new Cartesian2(1.0, 1.0),
      speed: 1
    }
  },
  customMaterial
}) => {

  // 构建 graphics 的调试参数默认值
  const defaultGraphicsParams: GraphicsParams = {
    width: defaultParams.graphics.width ?? 10,
    height: defaultParams.graphics.height ?? 0,
  }

  // 获取控制面板参数
  const graphicsParams = useLevaControls(
    {
      name: `PolylineFlow_${controllerName}`,
      schema: { // 控制面板配置
        graphics: folder({
          width: {
            label: 'width【宽度】',
            value: defaultGraphicsParams.width
          },
          height: {
            label: 'height【高度】',
            value: defaultGraphicsParams.height
          },
        })
      },
      // folderSettings: {
      //   collapsed: false
      // }
    },
    enableDebug
  )

  // 构建 material 的调试参数默认值
  const defaultMaterialParams = {
    image: defaultParams.material.image ?? 'colors1.png',
    repeat: defaultParams.material.repeat ?? new Cartesian2(1.0, 1.0),
    color: defaultParams.material.color ?? { r: 0, g: 255, b: 255, a: 1 }
  }

  // 获取控制面板参数
  const materialParams = useLevaControls(
    {
      name: `PolylineFlow_${controllerName}`,
      schema: { // 控制面板配置
        material: folder({
          image: {
            label: 'image【贴图】',
            image: Colors1
          },
          color: {
            label: 'color【贴图叠加颜色】',
            value: defaultMaterialParams.color
          },
          repeat: {
            label: 'repeat【贴图重复次数】',
            value: [1.0, 1.0],
            min: 1
          },
          speed: {
            label: 'speed【动画流动速度】',
            value: 1,
            min: 0.1
          }
        })
      },
      // folderSettings: {
      //   collapsed: false
      // }
    },
    enableDebug
  )



  // 处理坐标
  const degreesArray = useMemo(() => {
    const reulst = polygonHierarchy.reduce((pre, cur) => {
      if (enableTransformCoordinate) {
        pre.push(...GCJ02_2_WGS84(cur[0], cur[1]), graphicsParams.height)
      } else {
        pre.push(cur[0], cur[1], graphicsParams.height)
      }
      return pre
    }, [])

    return reulst
  }, [graphicsParams.height])

  // 材质
  const material = useMemo(() => {
    // 使用自定义材质
    if (customMaterial) return customMaterial

    // 默认材质
    let { r, g, b, a } = materialParams.color
    r /= 255
    g /= 255
    b /= 255
    return new PolylineFlowMaterialProperty({
      image: materialParams.image,
      color: new Color(r, g, b, a),
      repeat: new Cartesian2(materialParams.repeat[0], materialParams.repeat[1]),
      speed: materialParams.speed
    })
  }, [materialParams])
  console.log('plylineflow');


  return (
    <Entity position={Cartesian3.fromDegrees(116.386378, 39.920743, 300)} >
      <PolylineGraphics
        positions={Cartesian3.fromDegreesArrayHeights(degreesArray)}
        width={defaultGraphicsParams.width}
        material={material}
        clampToGround={false} // 是否贴地
      />
    </Entity>
  )
}


export default memo(PolylineFlowEntity)