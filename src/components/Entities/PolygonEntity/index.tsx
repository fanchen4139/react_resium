import Colors1 from "@/assets/images/colors1.png";
import { Cartesian3, Color, Cartesian2, type MaterialProperty, ImageMaterialProperty, CornerType, ColorMaterialProperty, ClassificationType, type Viewer, JulianDate, Math as CesiumMath, CallbackProperty, type PolygonGraphics, } from "cesium";
import { forwardRef, memo, useImperativeHandle, useMemo, useRef, useState, type FC } from "react";
import { Entity, PolygonGraphics as ResiumPolygonGraphics, type CesiumComponentRef, type PolygonGraphicsProps } from "resium";
import useLevaControls from "../../../hooks/useLevaControls";
import type { DefaultControllerProps, CesiumImage, PartialWithout, RGBA } from "../../../types/Common";
import { GCJ02_2_WGS84 } from "../../../utils/coordinate";
import { folder } from "leva";
import { bounceIn, easeOut } from "@/utils/cesium/easingFunctions";


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

type PolygonProps = {
  enableTransformCoordinate?: boolean
  height?: number
  polygonHierarchy?: Array<number[]>
  defaultParams?: DefaultParams
  customMaterial?: Color | MaterialProperty
} & PartialWithout<DefaultControllerProps, 'enableDebug'>

export interface PolygonRef {
  /**
   * 将 polygon 提升指定的米数。
   * 
   * @param viewer - 用于提升 polygon 的 viewer 实例。
   * @param meter - 提升 polygon 的米数。
   * @param duration - 可选的提升动画持续时间（毫秒）。
   */
  raise: (viewer: Viewer, meter: number, duration?: number) => void;

  /**
   * 将 polygon 降低指定的米数。
   * 
   * @param viewer - 用于降低 polygon 的 viewer 实例。
   * @param meter - 降低 polygon 的米数。
   * @param duration - 可选的降低动画持续时间（毫秒）。
   */
  drop: (viewer: Viewer, meter: number, duration?: number) => void;
}
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
const PolygonEntity = forwardRef<PolygonRef, PolygonProps>(({
  controllerName = '',
  enableDebug = false,
  height = 0,
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
}, ref) => {
  defaultParams.graphics = defaultParams.graphics ?? {}
  // 构建 graphics 的调试参数默认值
  const defaultGraphicsParams: GraphicsParams = {
    cornerType: defaultParams.graphics.cornerType ?? CornerType.MITERED
  }

  // 获取控制面板参数
  const graphicsParams = useLevaControls(
    {
      name: `Polygon_${controllerName}`,
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
    }
  )

  // 构建 material 的调试参数默认值
  const defaultMaterialParams = {
    image: defaultParams.material.image ?? 'colors1.png',
    repeat: defaultParams.material.repeat ?? new Cartesian2(1.0, 1.0),
    color: defaultParams.material.color ?? { r: 255, g: 255, b: 255, a: 1 },
    transparent: defaultParams.material.transparent ?? false
  }

  // 获取控制面板参数
  const materialParams = useLevaControls(
    {
      name: `Polygon_${controllerName}`,
      schema: { // 控制面板配置
        material: folder({
          image: {
            label: 'image【贴图】',
            image: undefined
          },
          repeat: {
            label: 'repeat【贴图重复次数】',
            value: [1.0, 1.0],
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
    }
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
    return new Color(r, g, b, a)
  }, [materialParams])


  // 处理坐标
  const degreesArray = polygonHierarchy.reduce((pre, cur) => {
    if (enableTransformCoordinate) {
      pre.push(...GCJ02_2_WGS84(cur[0], cur[1]))
    } else {
      pre.push(cur[0], cur[1])
    }
    return pre
  }, [])

  const [recordHeight, setRecordHeight] = useState(height)
  const innerRef = useRef<CesiumComponentRef<PolygonGraphics>>(null)

  useImperativeHandle(ref, () =>
  ({
    raise: (viewer, meter, duration = 2) => {


      const startHeight = recordHeight
      const endHeight = startHeight + meter
      let startTime = null; // 延迟初始化 startTime

      // 动态更新高度
      const updateHeight = function (scene, time) {
        // 确保 startTime 在第一帧初始化
        if (!startTime) startTime = JulianDate.clone(time);

        let t = JulianDate.secondsDifference(time, startTime) / duration; // 归一化时间 0~1

        if (t > 1.0) t = 1.0; // 动画完成

        // 计算当前高度
        const currentHeight = CesiumMath.lerp(startHeight, endHeight, t);

        innerRef.current.cesiumElement.height = new CallbackProperty(() => currentHeight, false)
        const oldColor = innerRef.current.cesiumElement.material.getValue().color
        innerRef.current.cesiumElement.material = new ColorMaterialProperty(
          new Color(oldColor.red, oldColor.green, oldColor.blue, easeOut(t))
        )

        // 动画结束后停止更新
        if (t === 1.0) {
          setRecordHeight(currentHeight)
          viewer.scene.preUpdate.removeEventListener(updateHeight);
        }
      };
      viewer.scene.preUpdate.addEventListener(updateHeight);
    },
    drop: (viewer, meter, duration = 2) => {

      const startHeight = recordHeight
      const endHeight = startHeight - meter
      let startTime = null; // 延迟初始化 startTime

      // 动态更新高度
      const updateHeight = function (scene, time) {
        // 确保 startTime 在第一帧初始化
        if (!startTime) startTime = JulianDate.clone(time);

        let t = JulianDate.secondsDifference(time, startTime) / duration; // 归一化时间 0~1

        if (t > 1.0) t = 1.0; // 动画完成

        // 计算当前高度
        const currentHeight = CesiumMath.lerp(startHeight, endHeight, t);
        innerRef.current.cesiumElement.height = new CallbackProperty(() => currentHeight, false)
        const oldColor = innerRef.current.cesiumElement.material.getValue().color
        innerRef.current.cesiumElement.material = new ColorMaterialProperty(
          new Color(oldColor.red, oldColor.green, oldColor.blue, easeOut(1 - t))
        )

        // 动画结束后停止更新
        if (t === 1.0) {
          setRecordHeight(currentHeight)
          viewer.scene.preUpdate.removeEventListener(updateHeight);
        }
      };
      viewer.scene.preUpdate.addEventListener(updateHeight);
    },
  })
  )

  return (
    <Entity >

      <ResiumPolygonGraphics
        ref={innerRef}
        hierarchy={Cartesian3.fromDegreesArray(degreesArray)}
        // cornerType={graphicsParams.cornerType}
        height={height}
        fill={true}
        material={material}
        // closeTop
        // closeBottom
        classificationType={ClassificationType.TERRAIN}
      // outline
      // outlineColor={Color.BLACK}
      />

    </Entity>
  )
})


export default memo(PolygonEntity)