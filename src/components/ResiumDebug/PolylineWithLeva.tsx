import { memo, useMemo } from "react"
import { Polyline } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  Cartesian3,
  Color,
  DistanceDisplayCondition,
  Material,
} from "cesium"
import { folder } from "leva"

/**
 * PolylineWithLeva
 * - 用 Leva 控制 Polyline 属性
 * - 需放在 <PolylineCollection> 内使用
 */
const PolylineWithLeva = () => {
  const params = useLevaControls({
    name: "Polyline 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },
          loop: { label: "闭合 loop", value: false },
          width: { label: "线宽 width", value: 2, min: 0, step: 0.5 },

          longitudeArray: { label: "经度数组", value: [116, 116.02, 116.04] },
          latitudeArray: { label: "纬度数组", value: [39, 39.01, 39.02] },
          heightArray: { label: "高度数组", value: [0, 0, 0] },

          materialColor: { label: "材质颜色", value: "#00ff00" },
        },
        { collapsed: false }
      ),

      advanced: folder(
        {
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

  const material = useMemo(
    () =>
      Material.fromType("Color", {
        color: Color.fromCssColorString(params.materialColor),
      }),
    [params.materialColor]
  )

  const distanceDisplayCondition = useMemo(() => {
    return new DistanceDisplayCondition(
      params.distanceDisplayCondition[0],
      params.distanceDisplayCondition[1]
    )
  }, [params.distanceDisplayCondition[0], params.distanceDisplayCondition[1]])

  return (
    <Polyline
      show={params.show}
      loop={params.loop}
      width={params.width}
      positions={positions}
      material={material}
      distanceDisplayCondition={
        params.distanceDisplayCondition ? distanceDisplayCondition : undefined
      }
    />
  )
}

export default memo(PolylineWithLeva)
