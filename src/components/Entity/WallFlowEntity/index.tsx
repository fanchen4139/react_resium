import * as Cesium from "cesium";
import { folder, useControls } from "leva";
import { forwardRef, memo, useEffect, useMemo, useRef, useState, type FC } from "react";
import { Entity, WallGraphics } from "resium";
import useLevaControls from "@/hooks/useLevaControls.js";
import WallMaterialProperty, { WallFlowShader } from "@/engine/Source/DataSource/WallMaterialProperty.js";
import type { DefaultControllerProps, PartialWithout, RGBA } from "@/types/Common.js";
import { GCJ02_2_WGS84 } from "@/utils/coordinate/index.js";
import Colors1 from "@/assets/images/colors1.png";
import type { Color, MaterialProperty } from "cesium";

interface GraphicsParams {
  minimumHeight?: number
  maximumHeight?: number
  outlineColor?: RGBA
  outlineWidth?: number
  outline?: boolean
}
interface MaterialParams {
  speed?: number
  repeat?: number
  color?: RGBA
}

interface DefaultParams {
  graphics?: GraphicsParams
  material?: MaterialParams
}

type WallFlowEntityType = FC<{
  enableTransformCoordinate?: boolean
  polygonHierarchy?: Array<number[]>
  defaultParams?: DefaultParams
  customMaterial?: Color | MaterialProperty
} & PartialWithout<DefaultControllerProps, 'enableDebug'>
>

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
const WallFlowEntity: WallFlowEntityType = ({
  controllerName = '',
  enableDebug = false,
  enableTransformCoordinate = false,
  polygonHierarchy = [
    [116.386378, 39.920743],
    [116.386806, 39.91238],
    [116.395126, 39.912604],
    [116.39469, 39.920937],
    [116.386378, 39.920743],
  ],
  defaultParams = {
    graphics: {
      minimumHeight: 0,
      maximumHeight: 100,
      outlineColor: { r: 255, g: 255, b: 255, a: 1 },
      outlineWidth: 1,
      outline: false,
    },
    material: {
      speed: 1.0,
      repeat: 1.0,
      color: { r: 0, g: 255, b: 255, a: 1 }
    }
  },
  customMaterial
}) => {
  console.log('update wall');
  // const [defaultGraphicsParams, setDefaultGraphicsParams] = useState<GraphicsParams>({})
  // useEffect(() => {
  //   setDefaultGraphicsParams({
  //     minimumHeight: defaultParams.graphics.minimumHeight ?? 0,
  //     maximumHeight: defaultParams.graphics.maximumHeight ?? 100,
  //     outlineColor: defaultParams.graphics.outlineColor ?? { r: 255, g: 255, b: 255, a: 1 },
  //     outlineWidth: defaultParams.graphics.outlineWidth ?? 1,
  //     outline: defaultParams.graphics.outline ?? false,
  //   })
  // }, [defaultParams.graphics])

  // 构建 graphics 的调试参数默认值
  const defaultGraphicsParams: GraphicsParams = {
    minimumHeight: defaultParams.graphics.minimumHeight ?? 0,
    maximumHeight: defaultParams.graphics.maximumHeight ?? 100,
    outlineColor: defaultParams.graphics.outlineColor ?? { r: 255, g: 255, b: 255, a: 1 },
    outlineWidth: defaultParams.graphics.outlineWidth ?? 1,
    outline: defaultParams.graphics.outline ?? false,
  }


  const graphicsParams = useLevaControls({
    name: `Wall_${controllerName}`, // controllerName
    schema: { // Schema
      graphics: folder({
        minimumHeight: {
          label: 'minimumHeight【最小高度】',
          value: defaultGraphicsParams.minimumHeight,
          step: 1,
        },
        maximumHeight: {
          label: 'maximumHeight【最大高度】',
          value: defaultGraphicsParams.maximumHeight,
          step: 1,
        },
        outlineColor: {
          label: 'outlineColor【边框线颜色】',
          value: defaultGraphicsParams.outlineColor
        },
        outlineWidth: {
          label: 'outlineWidth【边框线宽度】',
          value: defaultGraphicsParams.outlineWidth,
          step: 1
        },
        outline: {
          label: 'outline【是否显示边框线】',
          value: defaultGraphicsParams.outline,
        },
      }),
    },
    // folderSettings: {
    //   collapsed: false
    // }
  },
    enableDebug
  )

  // 构建 material 的调试参数默认值
  const defaultMaterialParams: MaterialParams = {
    speed: defaultParams.material.speed ?? 1.0,
    repeat: defaultParams.material.repeat ?? 1.0,
    color: defaultParams.material.color ?? { r: 0, g: 255, b: 255, a: 1 }
  }

  const materialParams = useLevaControls({
    name: `Wall_${controllerName}`, // controllerName
    schema: { // Schema
      material: folder({
        speed: {
          label: 'speed【贴图动画执行速度】',
          value: defaultMaterialParams.speed,
          step: 0.1,
          min: 0.1,
        },
        repeat: {
          label: 'repeat【贴图重复次数】',
          value: defaultMaterialParams.repeat,
          step: 0.1,
          min: 1,
        },
        color: {
          label: 'color【贴图叠加颜色】',
          value: defaultMaterialParams.color
        },
      })
    },
    // folderSettings: {
    //   collapsed: false
    // }
  },
    enableDebug
  )

  // 墙体边框线颜色  
  const outlineColor = useMemo(() => {
    let { r, g, b, a } = graphicsParams.outlineColor
    r /= 255
    g /= 255
    b /= 255
    return new Cesium.Color(r, g, b, a)
  }, [graphicsParams.outlineColor])

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
  const maximumHeights = useMemo(
    () => new Cesium.CallbackProperty(() => polygonHierarchy.map(_ => graphicsParams.maximumHeight), false),
    [graphicsParams.maximumHeight]
  );

  // 墙体最小高度
  const minimumHeights = useMemo(
    () => new Cesium.CallbackProperty(() => polygonHierarchy.map(_ => graphicsParams.minimumHeight), false),
    [graphicsParams.minimumHeight]
  );

  // 墙体贴图
  const material = useMemo(() => {
    // 使用自定义材质
    if (customMaterial) return customMaterial

    // 默认材质
    let { r, g, b, a } = materialParams.color
    r /= 255
    g /= 255
    b /= 255
    return new WallMaterialProperty({
      image: Colors1,
      speed: materialParams.speed,
      color: new Cesium.Color(r, g, b, a),
      repeat: materialParams.repeat,
      shaderType: WallFlowShader.Clockwise
    })
  }, [materialParams, customMaterial])

  return (
    <Entity id={`wall_${controllerName}`} position={Cesium.Cartesian3.fromDegrees(116.386378, 39.920743, 0)} >
      <WallGraphics
        outline={graphicsParams.outline}
        outlineWidth={graphicsParams.outlineWidth}
        outlineColor={outlineColor}
        maximumHeights={maximumHeights}
        minimumHeights={minimumHeights}
        positions={Cesium.Cartesian3.fromDegreesArray(degreesArray)}
        material={material}
      />
    </Entity>
  )
}

export default memo(WallFlowEntity)