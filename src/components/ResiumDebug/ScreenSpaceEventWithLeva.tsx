import { memo } from "react"
import { ScreenSpaceEvent } from "resium"
import {
  KeyboardEventModifier,
  ScreenSpaceEventType,
} from "cesium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * ScreenSpaceEventWithLeva
 * - 用 Leva 控制 ScreenSpaceEvent
 * - 需放在 <ScreenSpaceEventHandler> 内使用
 */
const ScreenSpaceEventWithLeva = () => {
  const params = useLevaControls({
    name: "ScreenSpaceEvent 控制",
    schema: {
      event: folder(
        {
          enableEvent: { label: "启用事件", value: false },
          eventType: {
            label: "事件类型",
            options: ScreenSpaceEventType,
            value: ScreenSpaceEventType.LEFT_CLICK,
          },
          modifier: {
            label: "键盘修饰键",
            options: {
              None: "None",
              Shift: KeyboardEventModifier.SHIFT,
              Ctrl: KeyboardEventModifier.CTRL,
              Alt: KeyboardEventModifier.ALT,
            },
            value: "None",
          },
          logEvent: { label: "打印事件", value: true },
        },
        { collapsed: false }
      ),
    },
  })

  const modifier =
    params.modifier === "None"
      ? undefined
      : (params.modifier as KeyboardEventModifier)

  if (!params.enableEvent) return null

  return (
    <ScreenSpaceEvent
      type={params.eventType as ScreenSpaceEventType}
      modifier={modifier}
      action={(e) => {
        if (params.logEvent) {
          console.log("[ScreenSpaceEvent]", e)
        }
      }}
    />
  )
}

export default memo(ScreenSpaceEventWithLeva)
