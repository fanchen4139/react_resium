import { memo, type PropsWithChildren } from "react"
import { CustomDataSource, type CustomDataSourceProps } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * CustomDataSourceWithLeva
 * - Leva 面板控制 CustomDataSource 属性
 * - 需放在 <Viewer> 或 <CesiumWidget> 内使用
 * - 子组件可以是 <Entity> 到这个 DataSource
 */
type CustomDataSourceWithLevaProps = PropsWithChildren<
  Omit<CustomDataSourceProps, "name" | "show">
>

const CustomDataSourceWithLeva = ({
  children,
  onChange,
  onError,
  onLoading,
  ...props
}: CustomDataSourceWithLevaProps) => {
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

  // Complex props (clustering, clock, isLoading) remain passthrough-only.
  return (
    <CustomDataSource
      {...props}
      name={params.name}
      show={params.show}

      // 事件回调示例
      onChange={(dataSource) => {
        if (params.logOnChange) {
          console.log("[CustomDataSource onChange]", dataSource)
        }
        onChange?.(dataSource)
      }}
      onError={(dataSource, error) => {
        if (params.logOnError) {
          console.error("[CustomDataSource onError]", dataSource, error)
        }
        onError?.(dataSource, error)
      }}
      onLoading={(dataSource, isLoading) => {
        if (params.logOnLoading) {
          console.log(
            "[CustomDataSource onLoading]",
            dataSource,
            isLoading
          )
        }
        onLoading?.(dataSource, isLoading)
      }}
    >
      {children}
    </CustomDataSource>
  )
}

export default memo(CustomDataSourceWithLeva)
