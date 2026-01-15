import { memo } from "react"
import {
  ScreenSpaceEventHandler,
  ScreenSpaceEvent,
} from "resium"
import {
  KeyboardEventModifier,
  ScreenSpaceEventType,
} from "cesium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"

/**
 * ScreenSpaceEventHandlerWithLeva
 * - 用 Leva 控制 ScreenSpaceEventHandler
 * - 需放在 <Viewer> 或 <CesiumWidget> 内使用
 */
const ScreenSpaceEventHandlerWithLeva = () => {
  const params = useLevaControls({
    name: "ScreenSpaceEventHandler 控制",
    schema: {
      handler: folder(
        {
          useDefault: {
            label: "使用默认 handler",
            value: true,
          },
        },
        { collapsed: false }
      ),

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

  return (
    <ScreenSpaceEventHandler useDefault={params.useDefault}>
      {params.enableEvent ? (
        <ScreenSpaceEvent
          type={params.eventType as ScreenSpaceEventType}
          modifier={modifier}
          action={(e) => {
            if (params.logEvent) {
              console.log("[ScreenSpaceEvent]", e)
            }
          }}
        />
      ) : null}
    </ScreenSpaceEventHandler>
  )
}

export default memo(ScreenSpaceEventHandlerWithLeva)
