import { memo, useMemo } from "react"
import { Google2DImageryProvider } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { Rectangle } from "cesium"
import { folder } from "leva"

/**
 * Google2DImageryProviderWithLeva
 * - 用 Leva 控制 Google2DImageryProvider 参数
 * - 需放在 <ImageryLayer> 内使用
 */
const Google2DImageryProviderWithLeva = () => {
  const params = useLevaControls({
    name: "Google2DImageryProvider 控制",
    schema: {
      source: folder(
        {
          useIonAsset: { label: "使用 Cesium Ion", value: false },
          assetId: { label: "Ion assetId", value: "" },
          accessToken: { label: "Ion accessToken", value: "" },
          key: { label: "Google API Key", value: "" },
        },
        { collapsed: false }
      ),

      options: folder(
        {
          mapType: {
            label: "地图类型",
            options: {
              satellite: "satellite",
              terrain: "terrain",
              roadmap: "roadmap",
            },
            value: "satellite",
          },
          overlayLayerType: {
            label: "叠加层",
            options: {
              None: "",
              layerRoadmap: "layerRoadmap",
              layerStreetview: "layerStreetview",
              layerTraffic: "layerTraffic",
            },
            value: "",
          },
          language: { label: "语言 language", value: "" },
          region: { label: "区域 region", value: "" },
          minimumLevel: { label: "最小层级", value: 0, min: 0, step: 1 },
          maximumLevel: { label: "最大层级", value: 20, min: 0, step: 1 },
        },
        { collapsed: false }
      ),

      rectangle: folder(
        {
          useRectangle: { label: "限制 rectangle", value: false },
          west: { label: "西经 west", value: -180, step: 0.0001 },
          south: { label: "南纬 south", value: -90, step: 0.0001 },
          east: { label: "东经 east", value: 180, step: 0.0001 },
          north: { label: "北纬 north", value: 90, step: 0.0001 },
        },
        { collapsed: true }
      ),

      style: folder(
        {
          stylesJson: { label: "样式 JSON", value: "" },
        },
        { collapsed: true }
      ),

      events: folder(
        {
          logOnReady: { label: "打印 onReady", value: false },
        },
        { collapsed: true }
      ),
    },
  })

  const rectangle = useMemo(() => {
    if (!params.useRectangle) return undefined
    return Rectangle.fromDegrees(
      params.west,
      params.south,
      params.east,
      params.north
    )
  }, [params.useRectangle, params.west, params.south, params.east, params.north])

  const styles = useMemo(() => {
    if (!params.stylesJson) return undefined
    try {
      return JSON.parse(params.stylesJson)
    } catch {
      return undefined
    }
  }, [params.stylesJson])

  const overlayLayerType = params.overlayLayerType || undefined
  const language = params.language || undefined
  const region = params.region || undefined

  return (
    <Google2DImageryProvider
      mapType={params.mapType as "satellite" | "terrain" | "roadmap"}
      overlayLayerType={overlayLayerType as any}
      language={language}
      region={region}
      minimumLevel={params.minimumLevel}
      maximumLevel={params.maximumLevel}
      rectangle={rectangle}
      styles={styles}
      assetId={params.useIonAsset ? params.assetId || undefined : undefined}
      accessToken={params.useIonAsset ? params.accessToken || undefined : undefined}
      key={!params.useIonAsset ? params.key || undefined : undefined}
      onReady={(provider) => {
        if (params.logOnReady) {
          console.log("[Google2DImageryProvider onReady]", provider)
        }
      }}
    />
  )
}

export default memo(Google2DImageryProviderWithLeva)
