import { memo } from "react"
import { KmlDataSource } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * KmlDataSourceWithLeva
 * - Leva 面板动态控制 KmlDataSource 属性
 * - 支持 KML/KMZ URL 或字符串
 * - 可监听加载相关事件
 */
const KmlDataSourceWithLeva = () => {
  const params = useLevaControls({
    name: "KmlDataSource 控制",
    schema: {
      source: folder(
        {
          kmlUrl: { label: "KML/KMZ URL", value: "" },
          kmlString: { label: "KML 字符串", value: "" },
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
      events: folder(
        {
          logOnLoading: { label: "打印 onLoading", value: false },
          logOnError: { label: "打印 onError", value: false },
          logOnChange: { label: "打印 onChange", value: false },
          logOnRefresh: { label: "打印 onRefresh", value: false },
          logOnUnsupportedNode: {
            label: "打印 onUnsupportedNode",
            value: false,
          },
        },
        { collapsed: true }
      ),
    },
  })

  const getKmlSource = () => {
    if (params.kmlString) return params.kmlString
    if (params.kmlUrl) return params.kmlUrl
    return undefined
  }

  return (
    <KmlDataSource
      data={getKmlSource() as any}
      name={params.name || undefined}
      show={params.show}
      onLoading={(dataSource, isLoaded) => {
        if (params.logOnLoading) {
          console.log("[KmlDataSource onLoading]", dataSource, isLoaded)
        }
      }}
      onError={(dataSource, error) => {
        if (params.logOnError) {
          console.error("[KmlDataSource onError]", dataSource, error)
        }
      }}
      onChange={(dataSource) => {
        if (params.logOnChange) {
          console.log("[KmlDataSource onChange]", dataSource)
        }
      }}
      onRefresh={(dataSource, urlComponent) => {
        if (params.logOnRefresh) {
          console.log("[KmlDataSource onRefresh]", dataSource, urlComponent)
        }
      }}
      onUnsupportedNode={(dataSource) => {
        if (params.logOnUnsupportedNode) {
          console.log("[KmlDataSource onUnsupportedNode]", dataSource)
        }
      }}
    />
  )
}

export default memo(KmlDataSourceWithLeva)
