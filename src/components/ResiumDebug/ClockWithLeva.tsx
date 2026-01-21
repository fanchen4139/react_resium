import { memo, useCallback } from "react"
import { Clock, type ClockProps } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  Clock as CesiumClock,
  ClockRange,
  ClockStep,
  JulianDate
} from "cesium"

/**
 * ClockWithLeva
 * - 支持 Leva 面板控制 Clock 组件的所有可写属性
 * - 需要放在 <Viewer> 或 <CesiumWidget> 内部使用
 */
type ClockWithLevaProps = Omit<
  ClockProps,
  "shouldAnimate" | "canAnimate" | "clockStep" | "clockRange" | "multiplier" | "startTime" | "stopTime" | "currentTime"
>

const ClockWithLeva = ({
  onTick,
  onStop,
  ...props
}: ClockWithLevaProps) => {
  const params = useLevaControls({
    name: "Clock 控制",
    schema: {
      shouldAnimate: {
        label: "是否播放 shouldAnimate",
        value: false,
      },
      canAnimate: {
        label: "允许动画 canAnimate",
        value: true,
      },
      clockStep: {
        label: "步长 clockStep",
        value: ClockStep.SYSTEM_CLOCK_MULTIPLIER,
      },
      clockRange: {
        label: "范围 clockRange",
        value: ClockRange.UNBOUNDED,
      },
      multiplier: {
        label: "播放倍率 multiplier",
        value: 1,
        min: -10,
        max: 10,
        step: 0.1,
      },
      // 使用 ISO 字符串，通过 JulianDate.fromIso8601 解析
      startTimeIso: {
        label: "开始时间 startTime (ISO)",
        value: new Date().toISOString(),
      },
      stopTimeIso: {
        label: "停止时间 stopTime (ISO)",
        value: new Date(Date.now() + 3600 * 1000).toISOString(),
      },
      currentTimeIso: {
        label: "当前时间 currentTime (ISO)",
        value: new Date().toISOString(),
      },
    },
  })

  // 事件回调示例
  const handleTick = useCallback((clock: CesiumClock) => {
    // console.log("Clock tick - currentTime:", clock.currentTime)
  }, [])

  const handleStop = useCallback((clock: CesiumClock) => {
    console.log("Clock stopped at:", clock.currentTime)
  }, [])

  return (
    <Clock
      {...props}
      shouldAnimate={params.shouldAnimate}
      canAnimate={params.canAnimate}
      clockStep={params.clockStep}
      clockRange={params.clockRange}
      multiplier={params.multiplier}
      startTime={JulianDate.fromIso8601(params.startTimeIso)}
      stopTime={JulianDate.fromIso8601(params.stopTimeIso)}
      currentTime={JulianDate.fromIso8601(params.currentTimeIso)}
      onTick={onTick ?? handleTick}
      onStop={onStop ?? handleStop}
    />
  )
}

export default memo(ClockWithLeva)
