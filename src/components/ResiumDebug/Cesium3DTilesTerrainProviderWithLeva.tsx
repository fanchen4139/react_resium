import { memo, useMemo } from "react"
import { Cesium3DTilesTerrainProvider, type Cesium3DTilesTerrainProviderProps } from "resium"
import { Ellipsoid } from "cesium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * Cesium3DTilesTerrainProviderWithLeva
 * - 使用 Leva 控制 Cesium3DTilesTerrainProvider 的选项
 * - 作为 Globe 的 terrainProvider 使用
 */
type Cesium3DTilesTerrainProviderWithLevaProps = Omit<
  Cesium3DTilesTerrainProviderProps,
  "url" | "assetId" | "accessToken" | "requestVertexNormals" | "requestWaterMask" | "ellipsoid" | "credit"
>

const Cesium3DTilesTerrainProviderWithLeva = ({
  ...props
}: Cesium3DTilesTerrainProviderWithLevaProps) => {
  const params = useLevaControls({
    name: "3D Tiles 地形 TerrainProvider 控制",
    schema: {
      source: folder({
        url: { label: "地形 URL", value: "" },
        useIon: { label: "使用 Cesium Ion assetId", value: false },
        assetId: { label: "Ion Asset ID【Ion 资产 ID】", value: 0, min: 0 },
        accessToken: { label: "Ion Access Token【Ion 访问令牌】", value: "" },
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
    },
  })

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

  return (
    <Cesium3DTilesTerrainProvider
      {...props}
      url={!params.useIon && params.url ? params.url : undefined}
      requestVertexNormals={params.requestVertexNormals}
      requestWaterMask={params.requestWaterMask}
      ellipsoid={ellipsoid}
      credit={params.credit || undefined}
      accessToken={params.useIon && params.accessToken ? params.accessToken : undefined}
      assetId={params.useIon && params.assetId ? params.assetId : undefined}
    />
  )
}

export default memo(Cesium3DTilesTerrainProviderWithLeva)
