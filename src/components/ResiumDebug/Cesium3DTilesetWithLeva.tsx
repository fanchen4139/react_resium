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
import type { Schema } from "leva/dist/declarations/src/types"
import { folder } from "leva";
type Cesium3DTilesetWithLevaBaseProps = Partial<Cesium3DTilesetProps> & {
  name: string
  useModelMatrix?: boolean
  modelLng?: number
  modelLat?: number
  modelHeight?: number
}

type Cesium3DTilesetWithLevaProps =
  | (Cesium3DTilesetWithLevaBaseProps & {
      useModelMatrix: true
      modelLng: number
      modelLat: number
      modelHeight: number
    })
  | (Cesium3DTilesetWithLevaBaseProps & {
      useModelMatrix?: false
    })

type Cesium3DTilesetLevaParams = {
  url?: string
  show?: boolean
  useModelMatrix?: boolean
  modelLng?: number
  modelLat?: number
  modelHeight?: number
  maximumScreenSpaceError?: number
  cullRequestsWhileMoving?: boolean
  cullRequestsWhileMovingMultiplier?: number
  preloadWhenHidden?: boolean
  preloadFlightDestinations?: boolean
  preferLeaves?: boolean
  progressiveResolutionHeightFraction?: number
  debugFreezeFrame?: boolean
  debugColorizeTiles?: boolean
  debugWireframe?: boolean
  debugShowBoundingVolume?: boolean
  debugShowContentBoundingVolume?: boolean
  debugShowViewerRequestVolume?: boolean
  debugShowGeometricError?: boolean
  debugShowRenderingStatistics?: boolean
  debugShowMemoryUsage?: boolean
  debugShowUrl?: boolean
  shadows?: ShadowMode
  classificationType?: ClassificationType
  lightColor?: string
  colorBlendAmount?: number
  colorBlendMode?: Cesium3DTileColorBlendMode
  backFaceCulling?: boolean
  skipLevelOfDetail?: boolean
  baseScreenSpaceError?: number
  skipScreenSpaceErrorFactor?: number
  skipLevels?: number
  immediatelyLoadDesiredLevelOfDetail?: boolean
  loadSiblings?: boolean
  foveatedScreenSpaceError?: boolean
  foveatedConeSize?: number
  foveatedMinimumScreenSpaceErrorRelaxation?: number
  foveatedTimeDelay?: number
  dynamicScreenSpaceError?: boolean
  dynamicScreenSpaceErrorDensity?: number
  dynamicScreenSpaceErrorFactor?: number
  dynamicScreenSpaceErrorHeightFalloff?: number
  vectorClassificationOnly?: boolean
  vectorKeepDecodedPositions?: boolean
  splitDirection?: SplitDirection
  showCreditsOnScreen?: boolean
  featureIdLabel?: string
  instanceFeatureIdLabel?: string
  outlineColor?: string
  cacheBytes?: number
  maximumCacheOverflowBytes?: number
  enableCollision?: boolean
}
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
  const {
    name,
    useModelMatrix,
    modelLng,
    modelLat,
    modelHeight,
    url,
    show,
    maximumScreenSpaceError,
    cullRequestsWhileMoving,
    cullRequestsWhileMovingMultiplier,
    preloadWhenHidden,
    preloadFlightDestinations,
    preferLeaves,
    progressiveResolutionHeightFraction,
    debugFreezeFrame,
    debugColorizeTiles,
    debugWireframe,
    debugShowBoundingVolume,
    debugShowContentBoundingVolume,
    debugShowViewerRequestVolume,
    debugShowGeometricError,
    debugShowRenderingStatistics,
    debugShowMemoryUsage,
    debugShowUrl,
    shadows,
    classificationType,
    lightColor,
    colorBlendAmount,
    colorBlendMode,
    backFaceCulling,
    skipLevelOfDetail,
    baseScreenSpaceError,
    skipScreenSpaceErrorFactor,
    skipLevels,
    immediatelyLoadDesiredLevelOfDetail,
    loadSiblings,
    foveatedScreenSpaceError,
    foveatedConeSize,
    foveatedMinimumScreenSpaceErrorRelaxation,
    foveatedTimeDelay,
    dynamicScreenSpaceError,
    dynamicScreenSpaceErrorDensity,
    dynamicScreenSpaceErrorFactor,
    dynamicScreenSpaceErrorHeightFalloff,
    vectorClassificationOnly,
    vectorKeepDecodedPositions,
    splitDirection,
    showCreditsOnScreen,
    featureIdLabel,
    instanceFeatureIdLabel,
    outlineColor,
    cacheBytes,
    maximumCacheOverflowBytes,
    enableCollision,
    modelMatrix,
    ...restProps
  } = props

  const urlDefault =
    url === undefined
      ? ""
      : typeof url === "string"
        ? url
        : (url as { url?: string } | undefined)?.url ?? ""

  const lightColorDefault = useMemo(() => {
    if (!lightColor) return undefined
    const color = new Color(lightColor.x, lightColor.y, lightColor.z, 1)
    return color.toCssColorString()
  }, [lightColor])

  const outlineColorDefault = outlineColor?.toCssColorString()

  const schema: Schema = {}
  const basic: Schema = {}
  const debug: Schema = {}
  const shadowBlend: Schema = {}
  const advanced: Schema = {}
  const cache: Schema = {}

  if (url !== undefined) {
    basic.url = { label: "Tileset URL【瓦片集 URL】", value: urlDefault }
  }
  if (show !== undefined) {
    basic.show = { label: "显示 show", value: show }
  }
  if (useModelMatrix !== undefined) {
    basic.useModelMatrix = { label: "modelMatrix【模型矩阵】", value: useModelMatrix }
  }
  if (modelLng !== undefined) {
    basic.modelLng = { label: "模型经度", value: modelLng, step: 0.00001 }
  }
  if (modelLat !== undefined) {
    basic.modelLat = { label: "模型纬度", value: modelLat, step: 0.00001 }
  }
  if (modelHeight !== undefined) {
    basic.modelHeight = { label: "模型高度", value: modelHeight, step: 10 }
  }
  if (maximumScreenSpaceError !== undefined) {
    basic.maximumScreenSpaceError = {
      label: "最大屏幕误差",
      value: maximumScreenSpaceError,
      min: 0,
      step: 1,
    }
  }
  if (cullRequestsWhileMoving !== undefined) {
    basic.cullRequestsWhileMoving = {
      label: "移动时剔除请求",
      value: cullRequestsWhileMoving,
    }
  }
  if (cullRequestsWhileMovingMultiplier !== undefined) {
    basic.cullRequestsWhileMovingMultiplier = {
      label: "剔除权重",
      value: cullRequestsWhileMovingMultiplier,
      min: 0,
      step: 1,
    }
  }
  if (preloadWhenHidden !== undefined) {
    basic.preloadWhenHidden = {
      label: "隐藏时预加载",
      value: preloadWhenHidden,
    }
  }
  if (preloadFlightDestinations !== undefined) {
    basic.preloadFlightDestinations = {
      label: "飞行预加载",
      value: preloadFlightDestinations,
    }
  }
  if (preferLeaves !== undefined) {
    basic.preferLeaves = { label: "偏好叶子", value: preferLeaves }
  }
  if (progressiveResolutionHeightFraction !== undefined) {
    basic.progressiveResolutionHeightFraction = {
      label: "progressiveResolutionHeightFraction【逐步分辨率高度比例】",
      value: progressiveResolutionHeightFraction,
      min: 0,
      max: 1,
      step: 0.01,
    }
  }
  if (Object.keys(basic).length > 0) {
    schema.basic = folder(basic, { collapsed: false })
  }

  if (debugFreezeFrame !== undefined) {
    debug.debugFreezeFrame = {
      label: "debugFreezeFrame【冻结帧】",
      value: debugFreezeFrame,
    }
  }
  if (debugColorizeTiles !== undefined) {
    debug.debugColorizeTiles = {
      label: "debugColorizeTiles【彩色瓦片】",
      value: debugColorizeTiles,
    }
  }
  if (debugWireframe !== undefined) {
    debug.debugWireframe = {
      label: "debugWireframe【线框】",
      value: debugWireframe,
    }
  }
  if (debugShowBoundingVolume !== undefined) {
    debug.debugShowBoundingVolume = {
      label: "显示包围体",
      value: debugShowBoundingVolume,
    }
  }
  if (debugShowContentBoundingVolume !== undefined) {
    debug.debugShowContentBoundingVolume = {
      label: "显示内容包围体",
      value: debugShowContentBoundingVolume,
    }
  }
  if (debugShowViewerRequestVolume !== undefined) {
    debug.debugShowViewerRequestVolume = {
      label: "显示请求体",
      value: debugShowViewerRequestVolume,
    }
  }
  if (debugShowGeometricError !== undefined) {
    debug.debugShowGeometricError = {
      label: "显示几何误差",
      value: debugShowGeometricError,
    }
  }
  if (debugShowRenderingStatistics !== undefined) {
    debug.debugShowRenderingStatistics = {
      label: "显示统计",
      value: debugShowRenderingStatistics,
    }
  }
  if (debugShowMemoryUsage !== undefined) {
    debug.debugShowMemoryUsage = {
      label: "显示内存使用",
      value: debugShowMemoryUsage,
    }
  }
  if (debugShowUrl !== undefined) {
    debug.debugShowUrl = {
      label: "显示 URL",
      value: debugShowUrl,
    }
  }
  if (Object.keys(debug).length > 0) {
    schema.debug = folder(debug, { collapsed: true })
  }

  if (shadows !== undefined) {
    shadowBlend.shadows = {
      label: "阴影模式",
      value: shadows,
      options: {
        DISABLED: ShadowMode.DISABLED,
        ENABLED: ShadowMode.ENABLED,
        CAST_ONLY: ShadowMode.CAST_ONLY,
        RECEIVE_ONLY: ShadowMode.RECEIVE_ONLY,
      },
    }
  }
  if (classificationType !== undefined) {
    shadowBlend.classificationType = {
      label: "classificationType【分类类型】",
      value: classificationType,
      options: {
        TERRAIN: ClassificationType.TERRAIN,
        CESIUM_3D_TILE: ClassificationType.CESIUM_3D_TILE,
        BOTH: ClassificationType.BOTH,
      },
    }
  }
  if (lightColor !== undefined) {
    shadowBlend.lightColor = {
      label: "lightColor【光照颜色】",
      value: lightColorDefault,
    }
  }
  if (colorBlendAmount !== undefined) {
    shadowBlend.colorBlendAmount = {
      label: "颜色混合量",
      value: colorBlendAmount,
      min: 0,
      max: 1,
      step: 0.01,
    }
  }
  if (colorBlendMode !== undefined) {
    shadowBlend.colorBlendMode = {
      label: "颜色混合模式",
      value: colorBlendMode,
    }
  }
  if (backFaceCulling !== undefined) {
    shadowBlend.backFaceCulling = {
      label: "backFaceCulling【背面剔除】",
      value: backFaceCulling,
    }
  }
  if (outlineColor !== undefined) {
    shadowBlend.outlineColor = {
      label: "outlineColor【轮廓颜色】",
      value: outlineColorDefault,
    }
  }
  if (Object.keys(shadowBlend).length > 0) {
    schema.shadowBlend = folder(shadowBlend, { collapsed: true })
  }

  if (skipLevelOfDetail !== undefined) {
    advanced.skipLevelOfDetail = {
      label: "skipLevelOfDetail【跳过细节级别】",
      value: skipLevelOfDetail,
    }
  }
  if (baseScreenSpaceError !== undefined) {
    advanced.baseScreenSpaceError = {
      label: "baseScreenSpaceError【基础屏幕空间误差】",
      value: baseScreenSpaceError,
      min: 0,
      step: 1,
    }
  }
  if (skipScreenSpaceErrorFactor !== undefined) {
    advanced.skipScreenSpaceErrorFactor = {
      label: "skipScreenSpaceErrorFactor【跳过误差系数】",
      value: skipScreenSpaceErrorFactor,
      min: 0,
      step: 1,
    }
  }
  if (skipLevels !== undefined) {
    advanced.skipLevels = {
      label: "skipLevels【跳过层级】",
      value: skipLevels,
      min: 0,
      step: 1,
    }
  }
  if (immediatelyLoadDesiredLevelOfDetail !== undefined) {
    advanced.immediatelyLoadDesiredLevelOfDetail = {
      label: "immediatelyLoadDesiredLevelOfDetail【立即加载所需细节级别】",
      value: immediatelyLoadDesiredLevelOfDetail,
    }
  }
  if (loadSiblings !== undefined) {
    advanced.loadSiblings = { label: "loadSiblings【加载兄弟节点】", value: loadSiblings }
  }
  if (foveatedScreenSpaceError !== undefined) {
    advanced.foveatedScreenSpaceError = {
      label: "foveatedScreenSpaceError【注视点屏幕误差】",
      value: foveatedScreenSpaceError,
    }
  }
  if (foveatedConeSize !== undefined) {
    advanced.foveatedConeSize = {
      label: "foveatedConeSize【注视点锥体大小】",
      value: foveatedConeSize,
      min: 0,
      max: 1,
      step: 0.01,
    }
  }
  if (foveatedMinimumScreenSpaceErrorRelaxation !== undefined) {
    advanced.foveatedMinimumScreenSpaceErrorRelaxation = {
      label: "foveatedMinimumScreenSpaceErrorRelaxation【注视点最小误差放松】",
      value: foveatedMinimumScreenSpaceErrorRelaxation,
      min: 0,
      step: 0.1,
    }
  }
  if (foveatedTimeDelay !== undefined) {
    advanced.foveatedTimeDelay = {
      label: "foveatedTimeDelay【注视点延迟】",
      value: foveatedTimeDelay,
      min: 0,
      step: 0.1,
    }
  }
  if (dynamicScreenSpaceError !== undefined) {
    advanced.dynamicScreenSpaceError = {
      label: "动态屏幕误差",
      value: dynamicScreenSpaceError,
    }
  }
  if (dynamicScreenSpaceErrorDensity !== undefined) {
    advanced.dynamicScreenSpaceErrorDensity = {
      label: "动态屏幕误差 密度",
      value: dynamicScreenSpaceErrorDensity,
      step: 0.0001,
    }
  }
  if (dynamicScreenSpaceErrorFactor !== undefined) {
    advanced.dynamicScreenSpaceErrorFactor = {
      label: "动态误差 因子",
      value: dynamicScreenSpaceErrorFactor,
      step: 0.1,
    }
  }
  if (dynamicScreenSpaceErrorHeightFalloff !== undefined) {
    advanced.dynamicScreenSpaceErrorHeightFalloff = {
      label: "动态误差高度衰减",
      value: dynamicScreenSpaceErrorHeightFalloff,
      min: 0,
      step: 0.01,
    }
  }
  if (vectorClassificationOnly !== undefined) {
    advanced.vectorClassificationOnly = {
      label: "vectorClassificationOnly【仅向量分类】",
      value: vectorClassificationOnly,
    }
  }
  if (vectorKeepDecodedPositions !== undefined) {
    advanced.vectorKeepDecodedPositions = {
      label: "vectorKeepDecodedPositions【保留解码位置】",
      value: vectorKeepDecodedPositions,
    }
  }
  if (splitDirection !== undefined) {
    advanced.splitDirection = {
      label: "splitDirection【分屏方向】",
      value: splitDirection,
      options: {
        NONE: SplitDirection.NONE,
        LEFT: SplitDirection.LEFT,
        RIGHT: SplitDirection.RIGHT,
      },
    }
  }
  if (Object.keys(advanced).length > 0) {
    schema.advanced = folder(advanced, { collapsed: true })
  }

  if (showCreditsOnScreen !== undefined) {
    cache.showCreditsOnScreen = {
      label: "showCreditsOnScreen【屏幕显示版权】",
      value: showCreditsOnScreen,
    }
  }
  if (featureIdLabel !== undefined) {
    cache.featureIdLabel = {
      label: "featureIdLabel【特征 ID 标签】",
      value: featureIdLabel,
    }
  }
  if (instanceFeatureIdLabel !== undefined) {
    cache.instanceFeatureIdLabel = {
      label: "instanceFeatureIdLabel【实例特征 ID 标签】",
      value: instanceFeatureIdLabel,
    }
  }
  if (cacheBytes !== undefined) {
    cache.cacheBytes = {
      label: "cacheBytes【缓存字节】",
      value: cacheBytes,
      min: 0,
      step: 1024,
    }
  }
  if (maximumCacheOverflowBytes !== undefined) {
    cache.maximumCacheOverflowBytes = {
      label: "maximumCacheOverflowBytes【最大缓存溢出字节】",
      value: maximumCacheOverflowBytes,
      min: 0,
      step: 1024,
    }
  }
  if (enableCollision !== undefined) {
    cache.enableCollision = { label: "enableCollision【启用碰撞】", value: enableCollision }
  }
  if (Object.keys(cache).length > 0) {
    schema.cache = folder(cache, { collapsed: true })
  }

  const params = useLevaControls({
    name: `Cesium3DTileset 控制.${name}`,
    schema,
  }) as Cesium3DTilesetLevaParams

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

  const modelMatrixValue = useMemo(() => {
    if (useModelMatrix === undefined) return modelMatrix
    if (!params.useModelMatrix) return modelMatrix
    if (
      params.modelLng === undefined ||
      params.modelLat === undefined ||
      params.modelHeight === undefined
    ) {
      return modelMatrix
    }
    const center = Cartesian3.fromDegrees(
      params.modelLng,
      params.modelLat,
      params.modelHeight
    )
    return Transforms.eastNorthUpToFixedFrame(center)
  }, [
    useModelMatrix,
    modelMatrix,
    params.useModelMatrix,
    params.modelLng,
    params.modelLat,
    params.modelHeight,
  ])

  const lightColorValue = useMemo(() => {
    if (lightColor === undefined) return undefined
    if (!params.lightColor) return undefined
    const color = Color.fromCssColorString(params.lightColor)
    return new Cartesian3(color.red, color.green, color.blue)
  }, [lightColor, params.lightColor])

  const tilesetProps: Cesium3DTilesetProps = {
    ...(restProps as Cesium3DTilesetProps),
  }
  if (url !== undefined) {
    tilesetProps.url = params.url ?? urlDefault
  }
  if (show !== undefined) {
    tilesetProps.show = params.show
  }
  if (useModelMatrix !== undefined) {
    tilesetProps.modelMatrix = modelMatrixValue
  } else if (modelMatrix !== undefined) {
    tilesetProps.modelMatrix = modelMatrix
  }
  if (maximumScreenSpaceError !== undefined) {
    tilesetProps.maximumScreenSpaceError = params.maximumScreenSpaceError
  }
  if (cullRequestsWhileMoving !== undefined) {
    tilesetProps.cullRequestsWhileMoving = params.cullRequestsWhileMoving
  }
  if (cullRequestsWhileMovingMultiplier !== undefined) {
    tilesetProps.cullRequestsWhileMovingMultiplier =
      params.cullRequestsWhileMovingMultiplier
  }
  if (preloadWhenHidden !== undefined) {
    tilesetProps.preloadWhenHidden = params.preloadWhenHidden
  }
  if (preloadFlightDestinations !== undefined) {
    tilesetProps.preloadFlightDestinations = params.preloadFlightDestinations
  }
  if (preferLeaves !== undefined) {
    tilesetProps.preferLeaves = params.preferLeaves
  }
  if (progressiveResolutionHeightFraction !== undefined) {
    tilesetProps.progressiveResolutionHeightFraction =
      params.progressiveResolutionHeightFraction
  }
  if (skipLevelOfDetail !== undefined) {
    tilesetProps.skipLevelOfDetail = params.skipLevelOfDetail
  }
  if (baseScreenSpaceError !== undefined) {
    tilesetProps.baseScreenSpaceError = params.baseScreenSpaceError
  }
  if (skipScreenSpaceErrorFactor !== undefined) {
    tilesetProps.skipScreenSpaceErrorFactor = params.skipScreenSpaceErrorFactor
  }
  if (skipLevels !== undefined) {
    tilesetProps.skipLevels = params.skipLevels
  }
  if (immediatelyLoadDesiredLevelOfDetail !== undefined) {
    tilesetProps.immediatelyLoadDesiredLevelOfDetail =
      params.immediatelyLoadDesiredLevelOfDetail
  }
  if (loadSiblings !== undefined) {
    tilesetProps.loadSiblings = params.loadSiblings
  }
  if (foveatedScreenSpaceError !== undefined) {
    tilesetProps.foveatedScreenSpaceError = params.foveatedScreenSpaceError
  }
  if (foveatedConeSize !== undefined) {
    tilesetProps.foveatedConeSize = params.foveatedConeSize
  }
  if (foveatedMinimumScreenSpaceErrorRelaxation !== undefined) {
    tilesetProps.foveatedMinimumScreenSpaceErrorRelaxation =
      params.foveatedMinimumScreenSpaceErrorRelaxation
  }
  if (foveatedTimeDelay !== undefined) {
    tilesetProps.foveatedTimeDelay = params.foveatedTimeDelay
  }
  if (debugShowBoundingVolume !== undefined) {
    tilesetProps.debugShowBoundingVolume = params.debugShowBoundingVolume
  }
  if (debugFreezeFrame !== undefined) {
    tilesetProps.debugFreezeFrame = params.debugFreezeFrame
  }
  if (debugColorizeTiles !== undefined) {
    tilesetProps.debugColorizeTiles = params.debugColorizeTiles
  }
  if (debugWireframe !== undefined) {
    tilesetProps.debugWireframe = params.debugWireframe
  }
  if (debugShowContentBoundingVolume !== undefined) {
    tilesetProps.debugShowContentBoundingVolume =
      params.debugShowContentBoundingVolume
  }
  if (debugShowViewerRequestVolume !== undefined) {
    tilesetProps.debugShowViewerRequestVolume =
      params.debugShowViewerRequestVolume
  }
  if (debugShowGeometricError !== undefined) {
    tilesetProps.debugShowGeometricError = params.debugShowGeometricError
  }
  if (debugShowRenderingStatistics !== undefined) {
    tilesetProps.debugShowRenderingStatistics =
      params.debugShowRenderingStatistics
  }
  if (debugShowMemoryUsage !== undefined) {
    tilesetProps.debugShowMemoryUsage = params.debugShowMemoryUsage
  }
  if (debugShowUrl !== undefined) {
    tilesetProps.debugShowUrl = params.debugShowUrl
  }
  if (shadows !== undefined) {
    tilesetProps.shadows = params.shadows
  }
  if (classificationType !== undefined) {
    tilesetProps.classificationType = params.classificationType
  }
  if (lightColor !== undefined) {
    tilesetProps.lightColor = lightColorValue
  }
  if (colorBlendAmount !== undefined) {
    tilesetProps.colorBlendAmount = params.colorBlendAmount
  }
  if (colorBlendMode !== undefined) {
    tilesetProps.colorBlendMode = params.colorBlendMode
  }
  if (backFaceCulling !== undefined) {
    tilesetProps.backFaceCulling = params.backFaceCulling
  }
  if (dynamicScreenSpaceError !== undefined) {
    tilesetProps.dynamicScreenSpaceError = params.dynamicScreenSpaceError
  }
  if (dynamicScreenSpaceErrorDensity !== undefined) {
    tilesetProps.dynamicScreenSpaceErrorDensity =
      params.dynamicScreenSpaceErrorDensity
  }
  if (dynamicScreenSpaceErrorFactor !== undefined) {
    tilesetProps.dynamicScreenSpaceErrorFactor =
      params.dynamicScreenSpaceErrorFactor
  }
  if (dynamicScreenSpaceErrorHeightFalloff !== undefined) {
    tilesetProps.dynamicScreenSpaceErrorHeightFalloff =
      params.dynamicScreenSpaceErrorHeightFalloff
  }
  if (vectorClassificationOnly !== undefined) {
    tilesetProps.vectorClassificationOnly = params.vectorClassificationOnly
  }
  if (vectorKeepDecodedPositions !== undefined) {
    tilesetProps.vectorKeepDecodedPositions = params.vectorKeepDecodedPositions
  }
  if (splitDirection !== undefined) {
    tilesetProps.splitDirection = params.splitDirection
  }
  if (showCreditsOnScreen !== undefined) {
    tilesetProps.showCreditsOnScreen = params.showCreditsOnScreen
  }
  if (featureIdLabel !== undefined) {
    tilesetProps.featureIdLabel = params.featureIdLabel || undefined
  }
  if (instanceFeatureIdLabel !== undefined) {
    tilesetProps.instanceFeatureIdLabel = params.instanceFeatureIdLabel || undefined
  }
  if (outlineColor !== undefined) {
    tilesetProps.outlineColor = Color.fromCssColorString(params.outlineColor)
  }
  if (cacheBytes !== undefined) {
    tilesetProps.cacheBytes = params.cacheBytes
  }
  if (maximumCacheOverflowBytes !== undefined) {
    tilesetProps.maximumCacheOverflowBytes = params.maximumCacheOverflowBytes
  }
  if (enableCollision !== undefined) {
    tilesetProps.enableCollision = params.enableCollision
  }

  // Complex Cesium3DTileset props (clippingPlanes, style, customShader, imageBasedLighting, ellipsoid) remain passthrough-only.
  return (
    <Cesium3DTileset
      {...tilesetProps}
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
