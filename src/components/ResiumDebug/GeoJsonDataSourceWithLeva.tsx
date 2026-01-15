import { memo } from "react"
import { GeoJsonDataSource } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { Color } from "cesium"
import { folder } from "leva"

/**
 * GeoJsonDataSourceWithLeva
 * - Leva 面板动态控制 GeoJsonDataSource 属性
 * - 支持 GeoJSON/TopoJSON URL 或字符串
 * - 可监听加载相关事件
 */
const GeoJsonDataSourceWithLeva = () => {
  const params = useLevaControls({
    name: "GeoJsonDataSource 控制",
    schema: {
      source: folder(
        {
          geoJsonUrl: { label: "GeoJSON URL", value: "" },
          geoJsonString: { label: "GeoJSON 字符串", value: "" },
        },
        { collapsed: false }
      ),
      display: folder(
        {
          name: { label: "名称", value: "" },
          show: { label: "显示 show", value: true },
        },
        { collapsed: false }
      ),
      style: folder(
        {
          stroke: { label: "描边颜色 stroke", value: "#00ff00" },
          strokeWidth: {
            label: "描边宽度 strokeWidth",
            value: 2,
            min: 0,
            step: 1,
          },
          fill: { label: "填充颜色 fill", value: "#00ff00" },
          markerSize: {
            label: "标记大小 markerSize",
            value: 48,
            min: 0,
            step: 1,
          },
          markerSymbol: { label: "标记符号", value: "" },
          markerColor: { label: "标记颜色", value: "#00ff00" },
        },
        { collapsed: true }
      ),
      options: folder(
        {
          clampToGround: { label: "贴地 clampToGround", value: false },
        },
        { collapsed: true }
      ),
      events: folder(
        {
          logOnLoading: { label: "打印 onLoading", value: false },
          logOnError: { label: "打印 onError", value: false },
          logOnChange: { label: "打印 onChange", value: false },
        },
        { collapsed: true }
      ),
    },
  })

  const getGeoJsonSource = () => {
    if (params.geoJsonString) {
      try {
        return JSON.parse(params.geoJsonString)
      } catch {
        return params.geoJsonString
      }
    }
    if (params.geoJsonUrl) return params.geoJsonUrl
    return undefined
  }

  return (
    <GeoJsonDataSource
      data={getGeoJsonSource() as any}
      name={params.name || undefined}
      show={params.show}
      clampToGround={params.clampToGround}
      stroke={Color.fromCssColorString(params.stroke)}
      strokeWidth={params.strokeWidth}
      fill={Color.fromCssColorString(params.fill)}
      markerSize={params.markerSize}
      markerSymbol={params.markerSymbol || undefined}
      markerColor={Color.fromCssColorString(params.markerColor)}
      onLoading={(dataSource, isLoaded) => {
        if (params.logOnLoading) {
          console.log("[GeoJsonDataSource onLoading]", dataSource, isLoaded)
        }
      }}
      onError={(dataSource, error) => {
        if (params.logOnError) {
          console.error("[GeoJsonDataSource onError]", dataSource, error)
        }
      }}
      onChange={(dataSource) => {
        if (params.logOnChange) {
          console.log("[GeoJsonDataSource onChange]", dataSource)
        }
      }}
    />
  )
}

export default memo(GeoJsonDataSourceWithLeva)
