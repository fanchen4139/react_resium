import { folder, useControls } from "leva";
import { forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef, useState, type FC } from "react";
import { Entity as ResiumEntity, WallGraphics, type CesiumComponentRef } from "resium";
import useLevaControls from "@/hooks/useLevaControls.js";
import WallMaterialProperty, { WallFlowShader } from "@/engine/Source/DataSource/WallMaterialProperty.js";
import type { DefaultControllerProps, PartialWithout, RGBA } from "@/types/Common.js";
import { GCJ02_2_WGS84 } from "@/utils/coordinate/index.js";
import Colors1 from "@/assets/images/colors1.png";
import download from "/download.png";
import { Color, DistanceDisplayCondition, type MaterialProperty, type Viewer, type Entity, Cartesian3, CallbackProperty, Cartographic, JulianDate, Matrix4, Math as CesiumMath, Cartesian2 } from "cesium";

interface GraphicsParams {
  minimumHeight?: number
  maximumHeight?: number
  outlineColor?: RGBA
  outlineWidth?: number
  outline?: boolean
}
interface MaterialParams {
  speed?: number
  repeat?: Cartesian2
  color?: RGBA
}

interface DefaultParams {
  graphics?: GraphicsParams
  material?: MaterialParams
}

type WallFlowEntityType = {
  enableTransformCoordinate?: boolean
  polygonHierarchy?: Array<number[]>
  defaultParams?: DefaultParams
  customMaterial?: Color | MaterialProperty
} & PartialWithout<DefaultControllerProps, 'enableDebug'>


export interface WallFlowEntityRef {
  /**
   * 将 wallGraphics 提升指定的米数。
   * 
   * @param viewer - 用于提升 wallGraphics 的 viewer 实例。
   * @param meter - 提升 wallGraphics 的米数。
   * @param duration - 可选的提升动画持续时间（毫秒）。
   */
  raise: (viewer: Viewer, meter: number, duration?: number) => void;

  /**
   * 将 wallGraphics 降低指定的米数。
   * 
   * @param viewer - 用于降低 wallGraphics 的 viewer 实例。
   * @param meter - 降低 wallGraphics 的米数。
   * @param duration - 可选的降低动画持续时间（毫秒）。
   */
  drop: (viewer: Viewer, meter: number, duration?: number) => void;
}

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
const WallFlowEntity = forwardRef<WallFlowEntityRef, WallFlowEntityType>(({
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
      repeat: new Cartesian2(1.0, 1.0),
      color: { r: 0, g: 255, b: 255, a: 1 }
    }
  },
  customMaterial
}, ref) => {

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
    repeat: defaultParams.material.repeat ?? new Cartesian2(1, 1),
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
          value: {
            x: defaultMaterialParams.repeat.x,
            y: defaultMaterialParams.repeat.y
          },
          step: 0.1,
          min: 0.1
        },
        color: {
          label: 'color【贴图叠加颜色】',
          value: defaultMaterialParams.color
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
    let { r, g, b, a } = graphicsParams.outlineColor
    r /= 255
    g /= 255
    b /= 255
    return new Color(r, g, b, a)
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
    () => new CallbackProperty(() => polygonHierarchy.map(_ => graphicsParams.maximumHeight), false),
    [graphicsParams.maximumHeight]
  );

  // 墙体最小高度
  const minimumHeights = useMemo(
    () => new CallbackProperty(() => polygonHierarchy.map(_ => graphicsParams.minimumHeight), false),
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
    console.log(materialParams.repeat);

    return new WallMaterialProperty({
      image: download,
      speed: materialParams.speed,
      // color: new Color(r, g, b, a),
      repeat: new Cartesian2(materialParams.repeat.x, materialParams.repeat.y),
      shaderType: WallFlowShader.Clockwise
    })
  }, [materialParams, customMaterial])

  // 记录当前高度的状态
  const [recordInfo, setRecordInfo] = useState({
    minimumHeights: graphicsParams.minimumHeight,
    maximumHeights: graphicsParams.maximumHeight
  })

  // 内部 Dom 的引用
  const innerRef = useRef<CesiumComponentRef<Entity>>(null)

  // 自定义属性和方法
  useImperativeHandle(ref, () =>
  ({
    raise: (viewer, meter, duration = 2) => {

      const entity = innerRef.current.cesiumElement

      const startHeight = recordInfo.minimumHeights
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
        entity.wall.minimumHeights = new CallbackProperty(() => polygonHierarchy.map(_ => currentHeight), false)
        const topToBottomDistance = recordInfo.maximumHeights - recordInfo.minimumHeights
        entity.wall.maximumHeights = new CallbackProperty(() => polygonHierarchy.map(_ => (currentHeight + topToBottomDistance)), false)

        // 动画结束后停止更新
        if (t === 1.0) {
          setRecordInfo({
            minimumHeights: recordInfo.minimumHeights + meter,
            maximumHeights: recordInfo.maximumHeights + meter
          })
          viewer.scene.preUpdate.removeEventListener(updateHeight);
        }
      };
      viewer.scene.preUpdate.addEventListener(updateHeight);
    },
    drop: (viewer, meter, duration = 2) => {

      const entity = innerRef.current.cesiumElement

      const startHeight = recordInfo.minimumHeights
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
        entity.wall.minimumHeights = new CallbackProperty(() => polygonHierarchy.map(_ => currentHeight), false)
        const topToBottomDistance = recordInfo.maximumHeights - recordInfo.minimumHeights
        entity.wall.maximumHeights = new CallbackProperty(() => polygonHierarchy.map(_ => (currentHeight + topToBottomDistance)), false)

        // 动画结束后停止更新
        if (t === 1.0) {
          setRecordInfo({
            minimumHeights: recordInfo.minimumHeights - meter,
            maximumHeights: recordInfo.maximumHeights - meter
          })
          viewer.scene.preUpdate.removeEventListener(updateHeight);
        }
      };
      viewer.scene.preUpdate.addEventListener(updateHeight);
    }
  })
  )

  return (
    <ResiumEntity ref={innerRef} id={`wall_${controllerName}`} position={Cartesian3.fromDegrees(116.386378, 39.920743, 0)} >
      <WallGraphics
        outline={graphicsParams.outline}
        outlineWidth={graphicsParams.outlineWidth}
        outlineColor={outlineColor}
        maximumHeights={maximumHeights}
        minimumHeights={minimumHeights}
        positions={Cartesian3.fromDegreesArray(degreesArray)}
        material={material}
      />
    </ResiumEntity>
  )
})

export default memo(WallFlowEntity)