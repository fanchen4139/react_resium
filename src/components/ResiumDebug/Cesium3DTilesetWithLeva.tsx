import { memo, useCallback } from "react"
import { Cesium3DTileset } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  ShadowMode,
  Cesium3DTileColorBlendMode
} from "cesium"

const Cesium3DTilesetWithLeva = () => {
  const params = useLevaControls({
    name: "Cesium3DTileset 控制",
    schema: {
      url: {
        label: "Tileset URL",
        value: "",
      },

      // 显示与优化
      show: { label: "显示 show", value: true },
      maximumScreenSpaceError: {
        label: "最大屏幕误差",
        value: 16,
        min: 0,
        step: 1,
      },
      cullRequestsWhileMoving: {
        label: "移动时剔除请求",
        value: true,
      },
      cullRequestsWhileMovingMultiplier: {
        label: "剔除权重",
        value: 60,
        min: 0,
        step: 1,
      },
      preloadWhenHidden: { label: "隐藏时预加载", value: false },
      preloadFlightDestinations: {
        label: "飞行预加载",
        value: false,
      },
      preferLeaves: { label: "偏好叶子", value: false },

      // 调试
      debugShowBoundingVolume: {
        label: "显示包围体",
        value: false,
      },
      debugShowGeometricError: {
        label: "显示几何误差",
        value: false,
      },
      debugShowRenderingStatistics: {
        label: "显示统计",
        value: false,
      },

      // Shadow / Blend
      shadows: {
        label: "阴影模式",
        value: ShadowMode.ENABLED,
      },
      colorBlendAmount: {
        label: "颜色混合量",
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.01,
      },
      colorBlendMode: {
        label: "颜色混合模式",
        value: Cesium3DTileColorBlendMode.HIGHLIGHT,
      },

      // 更多高级选项（可视情况扩展）
      dynamicScreenSpaceError: {
        label: "动态屏幕误差",
        value: false,
      },
      dynamicScreenSpaceErrorDensity: {
        label: "动态屏幕误差 密度",
        value: 0.00278,
        step: 0.0001,
      },
      dynamicScreenSpaceErrorFactor: {
        label: "动态误差 因子",
        value: 4,
        step: 0.1,
      },
    },
  })

  // 事件回调
  const handleAllTilesLoaded = useCallback(() => {
    console.log("所有瓦片已加载 ✅")
  }, [])
  const handleInitialTilesLoad = useCallback(() => {
    console.log("初始瓦片已加载 ⏱️")
  }, [])
  const handleLoadProgress = useCallback((remaining, processing) => {
    console.log(
      "加载进度：等待请求",
      remaining,
      " 正在处理",
      processing
    )
  }, [])
  const handleTileFailed = useCallback((error) => {
    console.error("瓦片加载失败 ❌", error)
  }, [])
  const handleTileLoad = useCallback((tile) => {
    console.log("单个瓦片加载", tile)
  }, [])
  const handleTileUnload = useCallback((tile) => {
    console.log("单个瓦片卸载", tile)
  }, [])

  return (
    <Cesium3DTileset
      url={params.url}
      show={params.show}
      maximumScreenSpaceError={params.maximumScreenSpaceError}
      cullRequestsWhileMoving={params.cullRequestsWhileMoving}
      cullRequestsWhileMovingMultiplier={
        params.cullRequestsWhileMovingMultiplier
      }
      preloadWhenHidden={params.preloadWhenHidden}
      preloadFlightDestinations={params.preloadFlightDestinations}
      preferLeaves={params.preferLeaves}
      debugShowBoundingVolume={params.debugShowBoundingVolume}
      debugShowGeometricError={params.debugShowGeometricError}
      debugShowRenderingStatistics={
        params.debugShowRenderingStatistics
      }
      shadows={params.shadows}
      colorBlendAmount={params.colorBlendAmount}
      colorBlendMode={params.colorBlendMode}
      dynamicScreenSpaceError={params.dynamicScreenSpaceError}
      dynamicScreenSpaceErrorDensity={
        params.dynamicScreenSpaceErrorDensity
      }
      dynamicScreenSpaceErrorFactor={
        params.dynamicScreenSpaceErrorFactor
      }

      onAllTilesLoad={handleAllTilesLoaded}
      onInitialTilesLoad={handleInitialTilesLoad}
      onLoadProgress={handleLoadProgress}
      onTileFailed={handleTileFailed}
      onTileLoad={handleTileLoad}
      onTileUnload={handleTileUnload}
    />
  )
}

export default memo(Cesium3DTilesetWithLeva)
