import { memo, useMemo } from "react"
import { CumulusCloud, type CumulusCloudProps } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  Cartesian3,
  Cartesian2,
  Color,
} from "cesium"
import { folder } from "leva"

/**
 * CumulusCloudWithLeva
 * - 支持 Leva 面板调试 CumulusCloud 属性
 * - 必须放在 CloudCollection 内部
 */
type CumulusCloudWithLevaProps = Omit<
  CumulusCloudProps,
  "show" | "position" | "color" | "brightness" | "scale" | "maximumSize" | "slice"
>

const CumulusCloudWithLeva = ({ ...props }: CumulusCloudWithLevaProps) => {
  const params = useLevaControls({
    name: "CumulusCloud 控制",
    schema: {
      basic: folder({
        show: { label: "显示 show", value: true },

        lng: { label: "经度", value: 116, step: 0.0001 },
        lat: { label: "纬度", value: 39, step: 0.0001 },
        height: { label: "高度 (m)", value: 5000, step: 100 },

        color: { label: "颜色", value: "#ffffff" },
        brightness: {
          label: "亮度 brightness",
          value: 1,
          min: 0,
          max: 1,
          step: 0.01,
        },
      }),

      size: folder({
        scaleX: {
          label: "Scale X【缩放 X】",
          value: 10000,
          min: 0,
          step: 100,
        },
        scaleY: {
          label: "Scale Y【缩放 Y】",
          value: 10000,
          min: 0,
          step: 100,
        },
        maxSizeX: {
          label: "最大尺寸 X",
          value: 20,
          min: 0,
          step: 1,
        },
        maxSizeY: {
          label: "最大尺寸 Y",
          value: 15,
          min: 0,
          step: 1,
        },
        maxSizeZ: {
          label: "最大尺寸 Z",
          value: 10,
          min: 0,
          step: 1,
        },
        slice: {
          label: "切片 slice",
          value: 0.5,
          min: -1,
          max: 1,
          step: 0.01,
        },
      }),
    },
  })

  // 将经纬度转换成 Cartesian3
  const position = useMemo(
    () => Cartesian3.fromDegrees(params.lng, params.lat, params.height),
    [params.lng, params.lat, params.height]
  )

  const scale = useMemo(
    () => new Cartesian2(params.scaleX, params.scaleY),
    [params.scaleX, params.scaleY]
  )

  const maximumSize = useMemo(
    () => new Cartesian3(params.maxSizeX, params.maxSizeY, params.maxSizeZ),
    [params.maxSizeX, params.maxSizeY, params.maxSizeZ]
  )

  return (
    <CumulusCloud
      {...props}
      show={params.show}
      position={position}
      color={Color.fromCssColorString(params.color)}
      brightness={params.brightness}
      scale={scale}
      maximumSize={maximumSize}
      slice={params.slice}
    />
  )
}

export default memo(CumulusCloudWithLeva)
