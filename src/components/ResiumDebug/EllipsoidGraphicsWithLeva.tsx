import { memo, useMemo } from "react"
import { EllipsoidGraphics } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  Cartesian3,
  Color,
  DistanceDisplayCondition,
  HeightReference,
  ShadowMode,
} from "cesium"
import { folder } from "leva"

/**
 * EllipsoidGraphicsWithLeva
 * - 用 Leva 控制 EllipsoidGraphics 属性
 * - 必须作为 <Entity> 子组件使用
 */
const EllipsoidGraphicsWithLeva = () => {
  const params = useLevaControls({
    name: "EllipsoidGraphics 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },
          fill: { label: "填充 fill", value: true },
          heightReference: {
            label: "高度参考 heightReference",
            options: HeightReference,
            value: HeightReference.NONE,
          },

          radiiX: { label: "半径 X", value: 3000, min: 0, step: 100 },
          radiiY: { label: "半径 Y", value: 3000, min: 0, step: 100 },
          radiiZ: { label: "半径 Z", value: 3000, min: 0, step: 100 },

          innerRadiiX: { label: "内半径 X", value: 0, min: 0, step: 100 },
          innerRadiiY: { label: "内半径 Y", value: 0, min: 0, step: 100 },
          innerRadiiZ: { label: "内半径 Z", value: 0, min: 0, step: 100 },
        },
        { collapsed: false }
      ),

      appearance: folder(
        {
          materialColor: { label: "填充颜色", value: "#00ff00" },
          outline: { label: "轮廓 outline", value: false },
          outlineColor: { label: "轮廓颜色", value: "#000000" },
          outlineWidth: {
            label: "轮廓宽度",
            value: 1,
            min: 0,
            step: 0.1,
          },
        },
        { collapsed: false }
      ),

      shape: folder(
        {
          minimumClock: {
            label: "最小时钟角 minimumClock",
            value: 0,
            min: 0,
            step: Math.PI / 180,
          },
          maximumClock: {
            label: "最大时钟角 maximumClock",
            value: Math.PI * 2,
            min: 0,
            step: Math.PI / 180,
          },
          minimumCone: {
            label: "最小锥角 minimumCone",
            value: 0,
            min: 0,
            step: Math.PI / 180,
          },
          maximumCone: {
            label: "最大锥角 maximumCone",
            value: Math.PI,
            min: 0,
            step: Math.PI / 180,
          },
          subdivisions: {
            label: "细分 subdivisions",
            value: 128,
            min: 0,
            step: 1,
          },
          stackPartitions: {
            label: "堆栈分段 stackPartitions",
            value: 64,
            min: 0,
            step: 1,
          },
          slicePartitions: {
            label: "切片分段 slicePartitions",
            value: 64,
            min: 0,
            step: 1,
          },
        },
        { collapsed: true }
      ),

      advanced: folder(
        {
          shadows: {
            label: "阴影 shadows",
            options: ShadowMode,
            value: ShadowMode.DISABLED,
          },
          distanceDisplayCondition: {
            label: "距离显示条件 [near, far]",
            value: [0, 1e7],
          },
        },
        { collapsed: true }
      ),
    },
  })

  const radii = useMemo(
    () => new Cartesian3(params.radiiX, params.radiiY, params.radiiZ),
    [params.radiiX, params.radiiY, params.radiiZ]
  )

  const innerRadii = useMemo(
    () => new Cartesian3(params.innerRadiiX, params.innerRadiiY, params.innerRadiiZ),
    [params.innerRadiiX, params.innerRadiiY, params.innerRadiiZ]
  )

  const materialColor = useMemo(
    () => Color.fromCssColorString(params.materialColor),
    [params.materialColor]
  )

  const outlineColor = useMemo(
    () => Color.fromCssColorString(params.outlineColor),
    [params.outlineColor]
  )

  const distanceDisplayCondition = useMemo(() => {
    return new DistanceDisplayCondition(
      params.distanceDisplayCondition[0],
      params.distanceDisplayCondition[1]
    )
  }, [params.distanceDisplayCondition[0], params.distanceDisplayCondition[1]])

  return (
    <EllipsoidGraphics
      show={params.show}
      fill={params.fill}
      heightReference={params.heightReference as HeightReference}
      radii={radii}
      innerRadii={innerRadii}
      material={materialColor}
      outline={params.outline}
      outlineColor={outlineColor}
      outlineWidth={params.outlineWidth}
      minimumClock={params.minimumClock}
      maximumClock={params.maximumClock}
      minimumCone={params.minimumCone}
      maximumCone={params.maximumCone}
      subdivisions={params.subdivisions}
      stackPartitions={params.stackPartitions}
      slicePartitions={params.slicePartitions}
      shadows={params.shadows as ShadowMode}
      distanceDisplayCondition={
        params.distanceDisplayCondition ? distanceDisplayCondition : undefined
      }
    />
  )
}

export default memo(EllipsoidGraphicsWithLeva)
