import { memo, useMemo } from "react"
import { Entity } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { Cartesian3, TrackingReferenceFrame } from "cesium"
import { folder } from "leva"

/**
 * EntityWithLeva
 * - 用 Leva 控制 Entity 关键属性
 * - 可作为 <Viewer>/<CesiumWidget>/<CustomDataSource> 子组件使用
 */
const EntityWithLeva: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const params = useLevaControls({
    name: "Entity 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },
          name: { label: "名称 name", value: "Leva Entity" },
          description: { label: "描述 description", value: "" },
        },
        { collapsed: false }
      ),

      position: folder(
        {
          usePosition: { label: "启用 position", value: true },
          lng: { label: "经度", value: 116.395102, step: 0.00001 },
          lat: { label: "纬度", value: 39.868458, step: 0.00001 },
          height: { label: "高度", value: 0, step: 100 },
        },
        { collapsed: false }
      ),

      advanced: folder(
        {
          selected: { label: "选中 selected", value: false },
          tracked: { label: "跟踪 tracked", value: false },
          trackingReferenceFrame: {
            label: "跟踪参考系",
            options: TrackingReferenceFrame,
            value: TrackingReferenceFrame.AUTODETECT,
          },
          useViewFrom: { label: "启用 viewFrom", value: false },
          viewFromX: { label: "viewFrom X", value: 0, step: 1 },
          viewFromY: { label: "viewFrom Y", value: 0, step: 1 },
          viewFromZ: { label: "viewFrom Z", value: 0, step: 1 },
        },
        { collapsed: true }
      ),
    },
  })

  const position = useMemo(
    () => Cartesian3.fromDegrees(params.lng, params.lat, params.height),
    [params.lng, params.lat, params.height]
  )

  const viewFrom = useMemo(
    () => new Cartesian3(params.viewFromX, params.viewFromY, params.viewFromZ),
    [params.viewFromX, params.viewFromY, params.viewFromZ]
  )

  return (
    <Entity
      show={params.show}
      name={params.name}
      description={params.description}
      position={params.usePosition ? position : undefined}
      selected={params.selected}
      tracked={params.tracked}
      trackingReferenceFrame={
        params.trackingReferenceFrame as TrackingReferenceFrame
      }
      viewFrom={params.useViewFrom ? viewFrom : undefined}
    >
      {children}
    </Entity>
  )
}

export default memo(EntityWithLeva)
