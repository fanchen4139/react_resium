import { memo } from "react"
import { CzmlDataSource, type CzmlDataSourceProps } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * CzmlDataSourceWithLeva
 * - Leva 面板动态控制 CzmlDataSource 属性
 * - 支持 CZML 加载 URL / 原始对象 / 字符串
 * - 可监听加载相关事件
 */
type CzmlDataSourceWithLevaProps = Omit<
  CzmlDataSourceProps,
  "data" | "show" | "name" | "sourceUri" | "credit"
>

const CzmlDataSourceWithLeva = ({
  onLoading,
  onError,
  onChange,
  ...props
}: CzmlDataSourceWithLevaProps) => {
  const params = useLevaControls({
    name: "CzmlDataSource 控制",
    schema: {
      source: folder({
        czmlUrl: {
          label: "CZML URL【CZML 数据 URL】",
          value: "",
        },
        czmlString: {
          label: "CZML 字符串",
          value: "",
        },
      }),

      display: folder({
        show: { label: "显示 show", value: true },
        name: { label: "name【名称】", value: "" },
        sourceUri: { label: "sourceUri【源 URI】", value: "" },
        credit: { label: "credit【信用】", value: "" },
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

  // Complex props (clustering, onLoad) remain passthrough-only.
  return (
    <CzmlDataSource
      {...props}
      data={getCzmlSource()}
      name={params.name || undefined}
      sourceUri={params.sourceUri || undefined}
      credit={params.credit || undefined}
      show={params.show}
      onLoading={(dataSource, isLoaded) => {
        if (params.logOnLoading) {
          console.log("[CzmlDataSource onLoading]", dataSource, isLoaded)
        }
        onLoading?.(dataSource, isLoaded)
      }}
      onError={(dataSource, error) => {
        if (params.logOnError) {
          console.error("[CzmlDataSource onError]", dataSource, error)
        }
        onError?.(dataSource, error)
      }}
      onChange={(dataSource) => {
        if (params.logOnChange) {
          console.log("[CzmlDataSource onChange]", dataSource)
        }
        onChange?.(dataSource)
      }}
    />
  )
}

export default memo(CzmlDataSourceWithLeva)
