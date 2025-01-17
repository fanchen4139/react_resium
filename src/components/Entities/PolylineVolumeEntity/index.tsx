import Colors1 from "@/assets/images/colors1.png";
import { Cartesian3, Color, Cartesian2, type MaterialProperty, ImageMaterialProperty, CornerType } from "cesium";
import { memo, useMemo, type FC } from "react";
import { Entity, PolylineVolumeGraphics } from "resium";
import useLevaControls from "../../../hooks/useLevaControls";
import type { DefaultControllerProps, CesiumImage, PartialWithout, RGBA } from "../../../types/Common";
import { GCJ02_2_WGS84 } from "../../../utils/coordinate";
import { folder } from "leva";


interface GraphicsParams {
  cornerType?: CornerType
}
interface MaterialParams {
  image?: CesiumImage
  color?: RGBA
  repeat?: Cartesian2
  transparent?: boolean
}

interface DefaultParams {
  graphics?: GraphicsParams
  material?: MaterialParams
}

type PolylineVolumeProps = {
  enableTransformCoordinate?: boolean
  polygonHierarchy?: Array<number[]>
  defaultParams?: DefaultParams
  customMaterial?: Color | MaterialProperty
} & PartialWithout<DefaultControllerProps, 'enableDebug'>

/** 
 * @description 创建多边形立体图形
 * @param {Object} props - 配置选项
 * @param {string} [props.controllerName] - 调试器折叠面板 name
 * @param {boolean} [props.enableDebug=false] - 是否启用调试模式
 * @param {PolygonHierarchy} props.polygonHierarchy - 多边形层次结构，定义了多边形的形状
 * @param {boolean} [props.enableTransformCoordinate] - 默认`true`: GCJ02 高德坐标系, `false`: WGS84 谷歌坐标系
 * @param {DefaultParams} [props.defaultParams] - 默认参数，可调试
 * @param {GraphicsParams} [props.defaultParams.graphics] - Entity 默认参数
 * @param {MaterialParams} [props.defaultParams.material] - Material 默认参数
 */
const PolylineVolumeEntity: FC<PolylineVolumeProps> = ({
  controllerName = '',
  enableDebug = false,
  enableTransformCoordinate = false,
  polygonHierarchy = [
    [116.386378, 39.920743],
    [116.386806, 39.91238],
    [116.395126, 39.912604],
    [116.39469, 39.920937],
    [116.386370, 39.9208],
    // [116.386404, 39.920312],
  ],
  //"longitude": 116.386404,
  //  "latitude": 39.920312,
  defaultParams = {
    graphics: {
      cornerType: CornerType.MITERED,
    },
    material: {
      image: Colors1,
      color: { r: 255, g: 255, b: 255, a: 1 },
      repeat: new Cartesian2(1.0, 1.0),
      transparent: false,
    }
  },
  customMaterial
}) => {

  // 构建 graphics 的调试参数默认值
  const defaultGraphicsParams: GraphicsParams = {
    cornerType: defaultParams.graphics.cornerType ?? CornerType.MITERED
  }

  // 获取控制面板参数
  const graphicsParams = useLevaControls(
    {
      name: `PolylineVolume_${controllerName}`,
      schema: { // 控制面板配置
        graphics: folder({
          cornerType: {
            label: 'cornerType【拐角形状】',
            value: defaultGraphicsParams.cornerType,
            options: {
              "圆角": CornerType.ROUNDED,
              "直角": CornerType.MITERED,
              "斜切": CornerType.BEVELED,
            }
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
    image: defaultParams.material.image ?? 'down.jpeg',
    repeat: defaultParams.material.repeat ?? new Cartesian2(1.0, 1.0),
    color: defaultParams.material.color ?? { r: 255, g: 255, b: 255, a: 1 },
    transparent: defaultParams.material.transparent ?? false
  }

  // 获取控制面板参数
  const materialParams = useLevaControls(
    {
      name: `PolylineVolume_${controllerName}`,
      schema: { // 控制面板配置
        material: folder({
          image: {
            label: 'image【贴图】',
            image: defaultMaterialParams.image
          },
          repeat: {
            label: 'repeat【贴图重复次数】',
            value: [2500, 1.0],
            min: 1
          },
          color: {
            label: 'color【贴图叠加颜色】',
            value: defaultMaterialParams.color
          },
          transparent: {
            label: 'transparent【是否透明】',
            value: defaultMaterialParams.transparent
          },

        })
      },
      // folderSettings: {
      //   collapsed: false
      // }
    },
    enableDebug
  )

  // 材质
  const material = useMemo(() => {
    // 使用自定义材质
    if (customMaterial) return customMaterial

    // 默认材质
    let { r, g, b, a } = materialParams.color
    r /= 255
    g /= 255
    b /= 255
    return new ImageMaterialProperty({
      image: 'https://zh.minecraft.wiki/images/Bedrock_JE2_BE2.png?13f82',
      repeat: new Cartesian2(materialParams.repeat[0], materialParams.repeat[1]),
      // color: new Color(r, g, b, a),
      // transparent: materialParams.transparent
    })
  }, [materialParams])


  // 处理坐标
  const degreesArray = polygonHierarchy.reduce((pre, cur) => {
    if (enableTransformCoordinate) {
      pre.push(...GCJ02_2_WGS84(cur[0], cur[1]), -100)
    } else {
      pre.push(cur[0], cur[1], -100)
    }
    return pre
  }, [])

  return (
    <Entity
      position={Cartesian3.fromDegrees(-74.0707383, 40.7117244, 100)}>

      <PolylineVolumeGraphics
        positions={Cartesian3.fromDegreesArrayHeights(degreesArray)}
        /**
         * 由一组(最少3组 Cartesian2 )构建出一个过原点(线段上的任意点)的横截面
         */
        shape={[
          new Cartesian2(-25, -200),
          new Cartesian2(25, -200),
          new Cartesian2(25, 200),
          new Cartesian2(-25, 200),
        ]}
        cornerType={graphicsParams.cornerType}
        material={material}
      // outline
      // outlineColor={Color.BLACK}
      />

    </Entity>
  )
}


export default memo(PolylineVolumeEntity)