import { memo, useMemo } from "react"
import { PolylineVolumeGraphics } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  Cartesian2,
  Cartesian3,
  Color,
  ColorMaterialProperty,
  CornerType,
  ShadowMode,
  DistanceDisplayCondition,
} from "cesium"
import { folder } from "leva"

/**
 * PolylineVolumeGraphicsWithLeva
 * - 用 Leva 控制 PolylineVolumeGraphics 属性
 * - 必须作为 <Entity> 子组件使用
 */
const PolylineVolumeGraphicsWithLeva = () => {
  const params = useLevaControls({
    name: "PolylineVolumeGraphics 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },

          // 路径坐标
          longitudeArray: { label: "经度数组", value: [116, 116.02, 116.04] },
          latitudeArray: { label: "纬度数组", value: [39, 39.01, 39.02] },
          heightArray: { label: "高度数组", value: [0, 0, 0] },

          // 横截面形状
          shapeX1: { label: "shape X1", value: 0, step: 10 },
          shapeX2: { label: "shape X2", value: 2000, step: 10 },
          shapeX3: { label: "shape X3", value: 2000, step: 10 },
          shapeX4: { label: "shape X4", value: 0, step: 10 },
          shapeY1: { label: "shape Y1", value: 0, step: 10 },
          shapeY2: { label: "shape Y2", value: 0, step: 10 },
          shapeY3: { label: "shape Y3", value: 1000, step: 10 },
          shapeY4: { label: "shape Y4", value: 1000, step: 10 },

          fill: { label: "填充 fill", value: true },
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

      advanced: folder(
        {
          cornerType: {
            label: "角落类型",
            options: CornerType,
            value: CornerType.ROUNDED,
          },
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

  const positions = useMemo(
    () =>
      params.longitudeArray.map((lng, index) =>
        Cartesian3.fromDegrees(
          lng,
          params.latitudeArray[index] ?? 0,
          params.heightArray[index] ?? 0
        )
      ),
    [params.longitudeArray, params.latitudeArray, params.heightArray]
  )

  const shape = useMemo(
    () => [
      new Cartesian2(params.shapeX1, params.shapeY1),
      new Cartesian2(params.shapeX2, params.shapeY2),
      new Cartesian2(params.shapeX3, params.shapeY3),
      new Cartesian2(params.shapeX4, params.shapeY4),
    ],
    [
      params.shapeX1,
      params.shapeX2,
      params.shapeX3,
      params.shapeX4,
      params.shapeY1,
      params.shapeY2,
      params.shapeY3,
      params.shapeY4,
    ]
  )

  const materialColor = useMemo(
    () =>
      new ColorMaterialProperty(
        Color.fromCssColorString(params.materialColor)
      ),
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
    <PolylineVolumeGraphics
      show={params.show}
      positions={positions}
      shape={shape}
      cornerType={params.cornerType as CornerType}
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

export default memo(PolylineVolumeGraphicsWithLeva)
