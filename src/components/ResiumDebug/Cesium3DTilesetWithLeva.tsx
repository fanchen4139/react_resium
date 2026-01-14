import { memo, useCallback, useMemo } from "react"
import { Cesium3DTileset, type Cesium3DTilesetProps } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  Cartesian3,
  ClassificationType,
  Color,
  ShadowMode,
  SplitDirection,
  Transforms,
  Cesium3DTileColorBlendMode
} from "cesium"

type Cesium3DTilesetWithLevaProps = Omit<
  Cesium3DTilesetProps,
  "url" | "show" | "modelMatrix" | "shadows" | "maximumScreenSpaceError" | "cullRequestsWhileMoving" | "cullRequestsWhileMovingMultiplier" | "preloadWhenHidden" | "preloadFlightDestinations" | "preferLeaves" | "progressiveResolutionHeightFraction" | "foveatedScreenSpaceError" | "foveatedConeSize" | "foveatedMinimumScreenSpaceErrorRelaxation" | "foveatedTimeDelay" | "dynamicScreenSpaceError" | "dynamicScreenSpaceErrorDensity" | "dynamicScreenSpaceErrorFactor" | "dynamicScreenSpaceErrorHeightFalloff" | "skipLevelOfDetail" | "baseScreenSpaceError" | "skipScreenSpaceErrorFactor" | "skipLevels" | "immediatelyLoadDesiredLevelOfDetail" | "loadSiblings" | "classificationType" | "lightColor" | "colorBlendAmount" | "colorBlendMode" | "debugFreezeFrame" | "debugColorizeTiles" | "debugWireframe" | "debugShowBoundingVolume" | "debugShowContentBoundingVolume" | "debugShowViewerRequestVolume" | "debugShowGeometricError" | "debugShowRenderingStatistics" | "debugShowMemoryUsage" | "debugShowUrl" | "backFaceCulling" | "vectorClassificationOnly" | "vectorKeepDecodedPositions" | "splitDirection" | "showCreditsOnScreen" | "featureIdLabel" | "instanceFeatureIdLabel" | "outlineColor" | "cacheBytes" | "maximumCacheOverflowBytes" | "enableCollision"
>

const Cesium3DTilesetWithLeva = ({
  onAllTilesLoad,
  onInitialTilesLoad,
  onLoadProgress,
  onTileFailed,
  onTileLoad,
  onTileUnload,
  onTileVisible,
  ...props
}: Cesium3DTilesetWithLevaProps) => {
  const params = useLevaControls({
    name: "Cesium3DTileset 控制",
    schema: {
      url: {
        label: "Tileset URL【瓦片集 URL】",
        value: "",
      },

      // 显示与优化
      show: { label: "显示 show", value: true },
      useModelMatrix: { label: "modelMatrix【模型矩阵】", value: false },
      modelLng: { label: "模型经度", value: 116.395102, step: 0.00001 },
      modelLat: { label: "模型纬度", value: 39.868458, step: 0.00001 },
      modelHeight: { label: "模型高度", value: 0, step: 10 },
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
      progressiveResolutionHeightFraction: {
        label: "progressiveResolutionHeightFraction【逐步分辨率高度比例】",
        value: 0.3,
        min: 0,
        max: 1,
        step: 0.01,
      },

      // 调试
      debugFreezeFrame: { label: "debugFreezeFrame【冻结帧】", value: false },
      debugColorizeTiles: { label: "debugColorizeTiles【彩色瓦片】", value: false },
      debugWireframe: { label: "debugWireframe【线框】", value: false },
      debugShowBoundingVolume: {
        label: "显示包围体",
        value: false,
      },
      debugShowContentBoundingVolume: {
        label: "显示内容包围体",
        value: false,
      },
      debugShowViewerRequestVolume: {
        label: "显示请求体",
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
      debugShowMemoryUsage: {
        label: "显示内存使用",
        value: false,
      },
      debugShowUrl: {
        label: "显示 URL",
        value: false,
      },

      // Shadow / Blend
      shadows: {
        label: "阴影模式",
        value: ShadowMode.ENABLED,
      },
      classificationType: {
        label: "classificationType【分类类型】",
        value: ClassificationType.BOTH,
        options: {
          TERRAIN: ClassificationType.TERRAIN,
          CESIUM_3D_TILE: ClassificationType.CESIUM_3D_TILE,
          BOTH: ClassificationType.BOTH,
        },
      },
      lightColor: {
        label: "lightColor【光照颜色】",
        value: "#ffffff",
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
      backFaceCulling: { label: "backFaceCulling【背面剔除】", value: true },

      // 更多高级选项（可视情况扩展）
      skipLevelOfDetail: { label: "skipLevelOfDetail【跳过细节级别】", value: false },
      baseScreenSpaceError: { label: "baseScreenSpaceError【基础屏幕空间误差】", value: 1024, min: 0, step: 1 },
      skipScreenSpaceErrorFactor: { label: "skipScreenSpaceErrorFactor【跳过误差系数】", value: 16, min: 0, step: 1 },
      skipLevels: { label: "skipLevels【跳过层级】", value: 1, min: 0, step: 1 },
      immediatelyLoadDesiredLevelOfDetail: { label: "immediatelyLoadDesiredLevelOfDetail【立即加载所需细节级别】", value: false },
      loadSiblings: { label: "loadSiblings【加载兄弟节点】", value: false },
      foveatedScreenSpaceError: { label: "foveatedScreenSpaceError【注视点屏幕误差】", value: true },
      foveatedConeSize: { label: "foveatedConeSize【注视点锥体大小】", value: 0.1, min: 0, max: 1, step: 0.01 },
      foveatedMinimumScreenSpaceErrorRelaxation: { label: "foveatedMinimumScreenSpaceErrorRelaxation【注视点最小误差放松】", value: 0, min: 0, step: 0.1 },
      foveatedTimeDelay: { label: "foveatedTimeDelay【注视点延迟】", value: 0, min: 0, step: 0.1 },
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
      dynamicScreenSpaceErrorHeightFalloff: {
        label: "动态误差高度衰减",
        value: 0.25,
        min: 0,
        step: 0.01,
      },
      vectorClassificationOnly: { label: "vectorClassificationOnly【仅向量分类】", value: false },
      vectorKeepDecodedPositions: { label: "vectorKeepDecodedPositions【保留解码位置】", value: false },
      splitDirection: {
        label: "splitDirection【分屏方向】",
        value: SplitDirection.NONE,
        options: {
          NONE: SplitDirection.NONE,
          LEFT: SplitDirection.LEFT,
          RIGHT: SplitDirection.RIGHT,
        },
      },
      showCreditsOnScreen: { label: "showCreditsOnScreen【屏幕显示版权】", value: false },
      featureIdLabel: { label: "featureIdLabel【特征 ID 标签】", value: "" },
      instanceFeatureIdLabel: { label: "instanceFeatureIdLabel【实例特征 ID 标签】", value: "" },
      outlineColor: { label: "outlineColor【轮廓颜色】", value: "#000000" },
      cacheBytes: { label: "cacheBytes【缓存字节】", value: 512 * 1024 * 1024, min: 0, step: 1024 },
      maximumCacheOverflowBytes: { label: "maximumCacheOverflowBytes【最大缓存溢出字节】", value: 512 * 1024 * 1024, min: 0, step: 1024 },
      enableCollision: { label: "enableCollision【启用碰撞】", value: false },
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

  const modelMatrix = useMemo(() => {
    if (!params.useModelMatrix) return undefined
    const center = Cartesian3.fromDegrees(params.modelLng, params.modelLat, params.modelHeight)
    return Transforms.eastNorthUpToFixedFrame(center)
  }, [params.useModelMatrix, params.modelLng, params.modelLat, params.modelHeight])

  const lightColor = useMemo(() => {
    const color = Color.fromCssColorString(params.lightColor)
    return new Cartesian3(color.red, color.green, color.blue)
  }, [params.lightColor])

  // Complex Cesium3DTileset props (clippingPlanes, style, customShader, imageBasedLighting, ellipsoid) remain passthrough-only.
  return (
    <Cesium3DTileset
      {...props}
      url={params.url}
      show={params.show}
      modelMatrix={modelMatrix}
      maximumScreenSpaceError={params.maximumScreenSpaceError}
      cullRequestsWhileMoving={params.cullRequestsWhileMoving}
      cullRequestsWhileMovingMultiplier={
        params.cullRequestsWhileMovingMultiplier
      }
      preloadWhenHidden={params.preloadWhenHidden}
      preloadFlightDestinations={params.preloadFlightDestinations}
      preferLeaves={params.preferLeaves}
      progressiveResolutionHeightFraction={params.progressiveResolutionHeightFraction}
      skipLevelOfDetail={params.skipLevelOfDetail}
      baseScreenSpaceError={params.baseScreenSpaceError}
      skipScreenSpaceErrorFactor={params.skipScreenSpaceErrorFactor}
      skipLevels={params.skipLevels}
      immediatelyLoadDesiredLevelOfDetail={params.immediatelyLoadDesiredLevelOfDetail}
      loadSiblings={params.loadSiblings}
      foveatedScreenSpaceError={params.foveatedScreenSpaceError}
      foveatedConeSize={params.foveatedConeSize}
      foveatedMinimumScreenSpaceErrorRelaxation={params.foveatedMinimumScreenSpaceErrorRelaxation}
      foveatedTimeDelay={params.foveatedTimeDelay}
      debugShowBoundingVolume={params.debugShowBoundingVolume}
      debugFreezeFrame={params.debugFreezeFrame}
      debugColorizeTiles={params.debugColorizeTiles}
      debugWireframe={params.debugWireframe}
      debugShowContentBoundingVolume={params.debugShowContentBoundingVolume}
      debugShowViewerRequestVolume={params.debugShowViewerRequestVolume}
      debugShowGeometricError={params.debugShowGeometricError}
      debugShowRenderingStatistics={
        params.debugShowRenderingStatistics
      }
      debugShowMemoryUsage={params.debugShowMemoryUsage}
      debugShowUrl={params.debugShowUrl}
      shadows={params.shadows}
      classificationType={params.classificationType}
      lightColor={lightColor}
      colorBlendAmount={params.colorBlendAmount}
      colorBlendMode={params.colorBlendMode}
      backFaceCulling={params.backFaceCulling}
      dynamicScreenSpaceError={params.dynamicScreenSpaceError}
      dynamicScreenSpaceErrorDensity={
        params.dynamicScreenSpaceErrorDensity
      }
      dynamicScreenSpaceErrorFactor={
        params.dynamicScreenSpaceErrorFactor
      }
      dynamicScreenSpaceErrorHeightFalloff={params.dynamicScreenSpaceErrorHeightFalloff}
      vectorClassificationOnly={params.vectorClassificationOnly}
      vectorKeepDecodedPositions={params.vectorKeepDecodedPositions}
      splitDirection={params.splitDirection}
      showCreditsOnScreen={params.showCreditsOnScreen}
      featureIdLabel={params.featureIdLabel || undefined}
      instanceFeatureIdLabel={params.instanceFeatureIdLabel || undefined}
      outlineColor={Color.fromCssColorString(params.outlineColor)}
      cacheBytes={params.cacheBytes}
      maximumCacheOverflowBytes={params.maximumCacheOverflowBytes}
      enableCollision={params.enableCollision}

      onAllTilesLoad={() => {
        handleAllTilesLoaded()
        onAllTilesLoad?.()
      }}
      onInitialTilesLoad={() => {
        handleInitialTilesLoad()
        onInitialTilesLoad?.()
      }}
      onLoadProgress={(remaining, processing) => {
        handleLoadProgress(remaining, processing)
        onLoadProgress?.(remaining, processing)
      }}
      onTileFailed={(error) => {
        handleTileFailed(error)
        onTileFailed?.(error)
      }}
      onTileLoad={(tile) => {
        handleTileLoad(tile)
        onTileLoad?.(tile)
      }}
      onTileUnload={(tile) => {
        handleTileUnload(tile)
        onTileUnload?.(tile)
      }}
      onTileVisible={onTileVisible}
    />
  )
}

export default memo(Cesium3DTilesetWithLeva)
