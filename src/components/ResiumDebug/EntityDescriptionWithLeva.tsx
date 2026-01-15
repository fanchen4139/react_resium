import { memo } from "react"
import { EntityDescription } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * EntityDescriptionWithLeva
 * - 用 Leva 控制 EntityDescription 内容
 * - 必须作为 <Entity> 子组件使用
 */
const EntityDescriptionWithLeva = () => {
  const params = useLevaControls({
    name: "EntityDescription 控制",
    schema: {
      basic: folder(
        {
          enable: { label: "启用描述", value: true },
          title: { label: "标题", value: "Entity Title" },
          content: { label: "内容", value: "Entity description content." },
          resizeInfoBox: { label: "自适应 InfoBox", value: true },
        },
        { collapsed: false }
      ),
    },
  })

  if (!params.enable) return null

  return (
    <EntityDescription resizeInfoBox={params.resizeInfoBox}>
      <div>
        <strong>{params.title}</strong>
      </div>
      <div>{params.content}</div>
    </EntityDescription>
  )
}

export default memo(EntityDescriptionWithLeva)
