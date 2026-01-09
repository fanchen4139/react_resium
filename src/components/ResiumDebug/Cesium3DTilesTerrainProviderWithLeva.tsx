import { memo, useMemo } from "react"
import { Cesium3DTilesTerrainProvider } from "resium"
import Cesium, { IonResource, Resource, Ellipsoid, Cartesian3 } from "cesium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * Cesium3DTilesTerrainProviderWithLeva
 * - 使用 Leva 控制 Cesium3DTilesTerrainProvider 的选项
 * - 作为 Viewer/Scene 的 terrainProvider 子节点使用
 */
const Cesium3DTilesTerrainProviderWithLeva = () => {
  const params = useLevaControls({
    name: "3D Tiles 地形 TerrainProvider 控制",
    schema: {
      source: folder({
        url: { label: "地形 URL", value: "" },
        useIon: { label: "使用 Cesium Ion assetId", value: false },
        assetId: { label: "Ion Asset ID", value: 0, min: 0 },
        accessToken: { label: "Ion Access Token", value: "" },
      }),
      options: folder({
        requestVertexNormals: { label: "请求顶点法线", value: true },
        requestWaterMask: { label: "请求水掩膜", value: false },
      }),
      ellipsoid: folder({
        useCustomEllipsoid: { label: "使用自定义椭球体", value: false },
        radiiX: { label: "椭球 X 半轴", value: 6378137, step: 1000 },
        radiiY: { label: "椭球 Y 半轴", value: 6378137, step: 1000 },
        radiiZ: { label: "椭球 Z 半轴", value: 6356752.314245, step: 1000 },
      }),
      credit: { label: "数据版权 Credit", value: "" },
      centerLng: { label: "目标经度", value: 116.395102, step: 0.00001 },
      centerLat: { label: "目标纬度", value: 39.868458, step: 0.00001 },
      centerHeight: { label: "目标高度", value: 0, step: 100 },
      radius: { label: "球体半径", value: 5000, min: 0, step: 100 },
      heading: { label: "偏航(°)", value: 0, step: 1 },
      pitch: { label: "俯仰(°)", value: -45, step: 1 },
      range: { label: "范围 range", value: 10000, min: 0, step: 100 },
    },
  })

  // 创建目标球体的 BoundingSphere 对象
  const boundingSphere = useMemo(
    () =>
      new Cesium.BoundingSphere(
        Cartesian3.fromDegrees(
          params.centerLng, // 获取经度
          params.centerLat, // 获取纬度
          params.centerHeight // 获取高度
        ),
        params.radius // 半径
      ),
    [
      params.centerLng,
      params.centerLat,
      params.centerHeight,
      params.radius,
    ]
  )

  // 计算偏移量 HeadingPitchRange
  const offset = useMemo(
    () =>
      new Cesium.HeadingPitchRange(
        Cesium.Math.toRadians(params.heading),
        Cesium.Math.toRadians(params.pitch),
        params.range
      ),
    [params.heading, params.pitch, params.range]
  )

  // 创建 Ion 资源或 URL 资源
  const terrainProvider = useMemo(() => {
    if (params.useIon && params.assetId > 0) {
      // 使用 Ion 资产 ID 创建资源
      const ionResource = IonResource.fromAssetId(params.assetId, {
        accessToken: params.accessToken,
      })
      return Cesium3DTilesTerrainProvider({
        url: ionResource,
        requestVertexNormals: params.requestVertexNormals,
        requestWaterMask: params.requestWaterMask,
      })
    }

    if (!params.url) return undefined

    // 如果没有 Ion Asset ID，则使用自定义 URL
    const resource = new Resource(params.url)
    return Cesium3DTilesTerrainProvider({
      url: resource,
      requestVertexNormals: params.requestVertexNormals,
      requestWaterMask: params.requestWaterMask,
    })
  }, [
    params.url,
    params.useIon,
    params.assetId,
    params.requestVertexNormals,
    params.requestWaterMask,
    params.accessToken,
  ])

  // 自定义椭球体（可选）
  const ellipsoid = useMemo(() => {
    if (!params.useCustomEllipsoid) return undefined
    return new Ellipsoid(
      params.radiiX,
      params.radiiY,
      params.radiiZ
    )
  }, [
    params.useCustomEllipsoid,
    params.radiiX,
    params.radiiY,
    params.radiiZ,
  ])

  // 如果没有配置地形提供器，返回 null
  if (!terrainProvider) return null

  return (
    <Cesium3DTilesTerrainProvider
      url={params.url}
      requestVertexNormals={params.requestVertexNormals}
      requestWaterMask={params.requestWaterMask}
      ellipsoid={ellipsoid}
      credit={params.credit || undefined}
      accessToken={params.accessToken || undefined}
      assetId={params.useIon && params.assetId ? params.assetId : undefined}
    />
  )
}

export default memo(Cesium3DTilesTerrainProviderWithLeva)
