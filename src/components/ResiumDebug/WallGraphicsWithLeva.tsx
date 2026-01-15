import { memo, useMemo } from "react"
import { WallGraphics } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  Cartesian3,
  Color,
  DistanceDisplayCondition,
  ShadowMode,
} from "cesium"
import { folder } from "leva"

/**
 * WallGraphicsWithLeva
 * - 用 Leva 控制 WallGraphics 属性
 * - 必须作为 <Entity> 子组件使用
 */
const WallGraphicsWithLeva = () => {
  const params = useLevaControls({
    name: "WallGraphics 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },

          // 墙体路径坐标
          longitudeArray: {
            label: "经度数组",
            value: [116, 116.01, 116.02],
          },
          latitudeArray: {
            label: "纬度数组",
            value: [39, 39.01, 39.005],
          },
          positionHeightArray: {
            label: "位置高度数组",
            value: [0, 0, 0],
          },

          minimumHeights: {
            label: "底部高度数组",
            value: [0, 0, 0],
          },
          maximumHeights: {
            label: "顶部高度数组",
            value: [5000, 5000, 5000],
          },

          fill: { label: "填充 fill", value: true },
          materialColor: { label: "材质颜色", value: "#00bcd4" },
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

      advanced: folder(
        {
          granularity: {
            label: "采样角度 granularity (弧度)",
            value: Math.PI / 180,
            min: 0,
            step: Math.PI / 180,
          },
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

  const cartesianPositions = useMemo(
    () =>
      params.longitudeArray.map((lng, index) =>
        Cartesian3.fromDegrees(
          lng,
          params.latitudeArray[index] ?? 0,
          params.positionHeightArray[index] ?? 0
        )
      ),
    [params.longitudeArray, params.latitudeArray, params.positionHeightArray]
  )

  const maximumHeights = useMemo(
    () =>
      params.longitudeArray.map(
        (_, index) => params.maximumHeights[index] ?? 0
      ),
    [params.longitudeArray, params.maximumHeights]
  )

  const minimumHeights = useMemo(
    () =>
      params.longitudeArray.map(
        (_, index) => params.minimumHeights[index] ?? 0
      ),
    [params.longitudeArray, params.minimumHeights]
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
    <WallGraphics
      show={params.show}
      positions={cartesianPositions}
      minimumHeights={minimumHeights}
      maximumHeights={maximumHeights}
      fill={params.fill}
      material={materialColor}
      outline={params.outline}
      outlineColor={outlineColor}
      outlineWidth={params.outlineWidth}
      granularity={params.granularity}
      shadows={params.shadows as ShadowMode}
      distanceDisplayCondition={
        params.distanceDisplayCondition ? distanceDisplayCondition : undefined
      }
    />
  )
}

export default memo(WallGraphicsWithLeva)
