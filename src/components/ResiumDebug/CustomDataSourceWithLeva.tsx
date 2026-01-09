import { memo } from "react"
import { CustomDataSource } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * CustomDataSourceWithLeva
 * - Leva 面板控制 CustomDataSource 属性
 * - 需放在 <Viewer> 或 <CesiumWidget> 内使用
 * - 子组件可以是 <Entity> 到这个 DataSource
 */
const CustomDataSourceWithLeva: React.FC<{
  children?: React.ReactNode
}> = ({ children }) => {
  const params = useLevaControls({
    name: "CustomDataSource 控制",
    schema: {
      basic: folder(
        {
          name: { label: "名称", value: "MyCustomDataSource" },
          show: { label: "显示", value: true },
        },
        { collapsed: false }
      ),
      events: folder(
        {
          // 是否打印事件日志
          logOnChange: { label: "打印 onChange", value: false },
          logOnError: { label: "打印 onError", value: false },
          logOnLoading: { label: "打印 onLoading", value: false },
        },
        { collapsed: true }
      ),
    },
  })

  return (
    <CustomDataSource
      name={params.name}
      show={params.show}

      // 事件回调示例
      onChange={(dataSource) => {
        if (params.logOnChange) {
          console.log("[CustomDataSource onChange]", dataSource)
        }
      }}
      onError={(dataSource, error) => {
        if (params.logOnError) {
          console.error("[CustomDataSource onError]", dataSource, error)
        }
      }}
      onLoading={(dataSource, isLoading) => {
        if (params.logOnLoading) {
          console.log(
            "[CustomDataSource onLoading]",
            dataSource,
            isLoading
          )
        }
      }}
    >
      {children}
    </CustomDataSource>
  )
}

export default memo(CustomDataSourceWithLeva)
