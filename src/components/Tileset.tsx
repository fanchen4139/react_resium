import { forwardRef, memo, useEffect, useImperativeHandle, useRef, useState, type FC, type MutableRefObject } from "react";
import { Cesium3DTileset as Resiuim3DTileset, type CesiumComponentRef } from "resium";
import useLevaControls from "../hooks/useLevaControls";
import type { DefaultControllerProps, PartialWithout } from "../types/Common";
import { transform } from "../utils/threeDTiles/translateTileset";
import type { BaseResiumRef } from "./RootResium";
import useCesium from "@/hooks/useCesium";
import { Cartesian3, JulianDate, Matrix4, Math as CesiumMath, Transforms, type Viewer, Cartographic, type Cesium3DTileset, ImageBasedLighting, ShadowMode, Cesium3DTileStyle } from "cesium";

type TilesetProps = {
  cesiumRef: MutableRefObject<BaseResiumRef>,
  height?: number
  url: string
} & PartialWithout<DefaultControllerProps, 'enableDebug'>

export interface TilesetRef {
  /**
   * 将 tileset 提升指定的米数。
   * 
   * @param viewer - 用于提升 tileset 的 viewer 实例。
   * @param meter - 提升 tileset 的米数。
   * @param duration - 可选的提升动画持续时间（毫秒）。
   */
  raise: (viewer: Viewer, meter: number, duration?: number) => void;

  /**
   * 将 tileset 降低指定的米数。
   * 
   * @param viewer - 用于降低 tileset 的 viewer 实例。
   * @param meter - 降低 tileset 的米数。
   * @param duration - 可选的降低动画持续时间（毫秒）。
   */
  drop: (viewer: Viewer, meter: number, duration?: number) => void;
}
/**
 * 使用 Cesium 渲染 3D Tileset 的 React 组件。
 * 
 * @component
 * @param {TilesetProps} props - Tileset 组件的属性。
 * @param {string} props.url - 瓦片集的 URL。
 * @param {boolean} [props.enableDebug=false] - 启用调试选项的标志。
 * @param {number} [props.height=0] - 瓦片集的初始高度。
 * @param {string} [props.controllerName="Tileset"] - 控制器的名称。
 * @param {React.Ref<TilesetRef>} ref - Tileset 组件的引用。
 * 
 * @returns {JSX.Element} 渲染的 Tileset 组件。
 * 
 * @example
 * ```tsx
 * <Tileset url="path/to/tileset" enableDebug={true} height={100} controllerName="MyTileset" ref={tilesetRef} />
 * ```
 * 
 * @typedef {Object} TilesetProps
 * @property {string} url - 瓦片集的 URL。
 * @property {boolean} [enableDebug=false] - 启用调试选项的标志。
 * @property {number} [height=0] - 瓦片集的初始高度。
 * @property {string} [controllerName="Tileset"] - 控制器的名称。
 * 
 * @typedef {Object} TilesetRef
 * @property {function} raise - 按指定米数在一段时间内提升瓦片集的函数。
 * @property {function} drop - 按指定米数在一段时间内降低瓦片集的函数。
 */
const Tileset = forwardRef<TilesetRef, TilesetProps>(({ url, enableDebug = false, height = 0, controllerName = "Tileset" }, ref) => {

  const [tile, setTile] = useState(null)

  const params = useLevaControls(
    {
      name: `Tileset_${controllerName}`,
      schema: {
        lng: {
          label: 'lng【经度】',
          value: 116.367831,
          step: 0.00001,
        },
        lat: {
          label: 'lat【纬度】',
          value: 39.907968,
          step: 0.00001,
        },
        height: {
          label: 'height【瓦片高度】',
          value: height,
          step: 50
        },
        rotateZ: {
          label: 'rotateZ【绕Z轴旋转角度】',
          value: 1.81,
          step: 0.01,
        },
        scale: {
          label: 'scale【缩放】',
          value: 0.964,
          step: 0.001,
        },
        debugFreezeFrame: {
          label: 'debugFreezeFrame【冻结当前帧】',
          value: false,
        },
        debugColorizeTiles: {
          label: 'debugColorizeTiles【以色彩结构化 Tileset】',
          value: false,
        },
        debugWireframe: {
          label: 'debugWireframe【渲染为线框】',
          value: false,
        },
        debugShowContentBoundingVolume: {
          label: 'debugShowContentBoundingVolume【显示瓦片的包围盒】',
          value: false,
        },
        debugShowViewerRequestVolume: {
          label: 'debugShowViewerRequestVolume【显示视锥体和请求体积】',
          value: false,
        },
        debugShowGeometricError: {
          label: 'debugShowGeometricError【显示瓦片的几何误差】',
          value: false,
        },
        debugShowRenderingStatistics: {
          label: 'debugShowRenderingStatistics【显示渲染统计信息】',
          value: false,
        },
        debugShowMemoryUsage: {
          label: 'debugShowMemoryUsage【显示内存使用情况】',
          value: false,
        },
        debugShowUrl: {
          label: 'debugShowUrl【显示瓦片的 URL】',
          value: false,
        },

      }
    },
    enableDebug
  )


  useEffect(() => {
    if (!tile) return
    transform(tile, { lng: params.lng, lat: params.lat, height: params.height }, { z: params.rotateZ }, params.scale)
  }, [params, tile])


  // 记录当前高度的状态
  const [recordHeight, setRecordHeight] = useState(params.height)

  // 内部 Dom 的引用
  const innerRef = useRef<CesiumComponentRef<Cesium3DTileset>>(null)
  // 自定义属性和方法
  useImperativeHandle(ref, () =>
  ({
    raise: (viewer, meter, duration = 2) => {

      const tileset = innerRef.current.cesiumElement

      const startHeight = recordHeight
      const endHeight = startHeight + meter

      const carteographic = Cartographic.fromCartesian(tileset.boundingSphere.center)

      const surface = Cartesian3.fromRadians(carteographic.longitude, carteographic.latitude, 0.0)

      let startTime = null; // 延迟初始化 startTime

      // 动态更新高度
      const updateHeight = function (scene, time) {
        // 确保 startTime 在第一帧初始化
        if (!startTime) startTime = JulianDate.clone(time);

        let t = JulianDate.secondsDifference(time, startTime) / duration; // 归一化时间 0~1

        if (t > 1.0) t = 1.0; // 动画完成

        // 计算当前高度
        const currentHeight = CesiumMath.lerp(startHeight, endHeight, t);
        const offset = Cartesian3.fromRadians(carteographic.longitude, carteographic.latitude, currentHeight)
        const translation = Cartesian3.subtract(offset, surface, new Cartesian3())
        // 更新模型矩阵
        tileset.modelMatrix = Matrix4.fromTranslation(translation)

        // 动画结束后停止更新
        if (t === 1.0) {
          setRecordHeight(currentHeight)
          viewer.scene.preUpdate.removeEventListener(updateHeight);
        }
      };
      viewer.scene.preUpdate.addEventListener(updateHeight);
    },
    drop: (viewer, meter, duration = 2) => {

      const tileset = innerRef.current.cesiumElement
      const startHeight = recordHeight

      const endHeight = recordHeight - meter

      const carteographic = Cartographic.fromCartesian(tileset.boundingSphere.center)

      const surface = Cartesian3.fromRadians(carteographic.longitude, carteographic.latitude, 0.0)

      let startTime = null; // 延迟初始化 startTime

      // 动态更新高度
      const updateHeight = function (scene, time) {
        // 确保 startTime 在第一帧初始化
        if (!startTime) startTime = JulianDate.clone(time);

        let t = JulianDate.secondsDifference(time, startTime) / duration; // 归一化时间 0~1
        if (t > 1.0) t = 1.0; // 动画完成

        // 计算当前高度
        const currentHeight = CesiumMath.lerp(startHeight, endHeight, t);

        const offset = Cartesian3.fromRadians(carteographic.longitude, carteographic.latitude, currentHeight)
        const translation = Cartesian3.subtract(offset, surface, new Cartesian3())
        // 更新模型矩阵
        tileset.modelMatrix = Matrix4.fromTranslation(translation)

        // 动画结束后停止更新
        if (t === 1.0) {
          setRecordHeight(currentHeight)
          viewer.scene.preUpdate.removeEventListener(updateHeight);
        }
      };
      viewer.scene.preUpdate.addEventListener(updateHeight);
    }
  })
  )

  return (
    <Resiuim3DTileset
      ref={innerRef} // 内部引用，用于访问 Cesium3DTileset 实例
      url={url} // 瓦片集的 URL
      onError={(err) => console.error(err)} // 错误处理
      enablePick // 启用拾取功能
      // shadows={0} // 关闭阴影
      // style={new Cesium3DTileStyle({
      //   color: "color('white')", // 设置瓦片的颜色样式
      // })}
      debugFreezeFrame={params.debugFreezeFrame} // 调试：冻结当前帧
      debugColorizeTiles={params.debugColorizeTiles} // 调试：以色彩结构化 Tileset
      debugWireframe={params.debugWireframe} // 调试：渲染为线框
      debugShowContentBoundingVolume={params.debugShowContentBoundingVolume} // 调试：显示瓦片的包围盒
      debugShowViewerRequestVolume={params.debugShowViewerRequestVolume} // 调试：显示视锥体和请求体积
      debugShowGeometricError={params.debugShowGeometricError} // 调试：显示瓦片的几何误差
      debugShowRenderingStatistics={params.debugShowRenderingStatistics} // 调试：显示渲染统计信息
      debugShowMemoryUsage={params.debugShowMemoryUsage} // 调试：显示内存使用情况
      debugShowUrl={params.debugShowUrl} // 调试：显示瓦片的 URL
      onReady={(tileset) => {
        setTile(tileset); // 当瓦片集准备好时，设置 tile 状态
      }}
    />
  );
})

export default memo(Tileset)