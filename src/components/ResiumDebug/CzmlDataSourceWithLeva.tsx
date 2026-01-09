import { memo } from "react"
import { CzmlDataSource } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { Resource } from "cesium"
import { folder } from "leva"

/**
 * CzmlDataSourceWithLeva
 * - Leva 面板动态控制 CzmlDataSource 属性
 * - 支持 CZML 加载 URL / 原始对象 / 字符串
 * - 可监听加载相关事件
 */
const CzmlDataSourceWithLeva = () => {
  const params = useLevaControls({
    name: "CzmlDataSource 控制",
    schema: {
      source: folder({
        czmlUrl: {
          label: "CZML URL",
          value: "",
        },
        czmlString: {
          label: "CZML 字符串",
          value: "",
        },
      }),

      display: folder({
        show: { label: "显示 show", value: true },
      }),

      events: folder({
        logOnLoading: {
          label: "打印 onLoading",
          value: false,
        },
        logOnError: {
          label: "打印 onError",
          value: false,
        },
        logOnChange: {
          label: "打印 onChange",
          value: false,
        },
      }),
    },
  })

  const getCzmlSource = () => {
    if (params.czmlString) {
      try {
        return JSON.parse(params.czmlString)
      } catch {
        return params.czmlString
      }
    }
    if (params.czmlUrl) {
      return params.czmlUrl
    }
    return undefined
  }

  return (
    <CzmlDataSource
      name={getCzmlSource() as any}
      show={params.show}
      onLoading={(dataSource, isLoaded) => {
        if (params.logOnLoading) {
          console.log("[CzmlDataSource onLoading]", dataSource, isLoaded)
        }
      }}
      onError={(dataSource, error) => {
        if (params.logOnError) {
          console.error("[CzmlDataSource onError]", dataSource, error)
        }
      }}
      onChange={(dataSource) => {
        if (params.logOnChange) {
          console.log("[CzmlDataSource onChange]", dataSource)
        }
      }}
    />
  )
}

export default memo(CzmlDataSourceWithLeva)
