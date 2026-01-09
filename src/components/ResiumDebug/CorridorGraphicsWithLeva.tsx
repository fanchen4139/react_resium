import { memo, useMemo } from "react"
import { CorridorGraphics } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import {
  Cartesian3,
  Color,
  ShadowMode,
  ClassificationType,
  HeightReference,
  CornerType,
} from "cesium"
import { folder } from "leva"

/**
 * CorridorGraphicsWithLeva
 * 拆分二维数组为三个独立的数组：经度、纬度、高度
 * 使用 Leva 控制并组合它们
 */
const CorridorGraphicsWithLeva = () => {
  const params = useLevaControls({
    name: "CorridorGraphics 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示", value: true },

          // 分别控制经度、纬度、高度数组
          longitudeArray: {
            label: "经度数组",
            value: [116, 116.01],
          },
          latitudeArray: {
            label: "纬度数组",
            value: [39, 39.01],
          },
          heightArray: {
            label: "高度数组",
            value: [0, 0],
          },

          width: { label: "宽度", value: 5000, min: 0, step: 100 },
          height: { label: "高度", value: 0, min: 0, step: 100 },
          extrudedHeight: {
            label: "挤出高度",
            value: 0,
            min: 0,
            step: 100,
          },
        }
      ),

      appearance: folder(
        {
          fill: { label: "填充", value: true },
          materialColor: { label: "颜色", value: "#ffffff" },

          outline: { label: "轮廓", value: false },
          outlineColor: {
            label: "轮廓颜色",
            value: "#000000",
          },
          outlineWidth: {
            label: "轮廓宽度",
            value: 1,
            min: 0,
            step: 0.1,
          },
        }
      ),

      advanced: folder(
        {
          heightReference: {
            label: "高度参考",
            options: HeightReference,
            value: HeightReference.NONE,
          },

          shadows: {
            label: "阴影模式",
            options: ShadowMode,
            value: ShadowMode.DISABLED,
          },

          classificationType: {
            label: "分类模式",
            options: ClassificationType,
            value: ClassificationType.BOTH,
          },

          cornerType: {
            label: "角落类型",
            options: CornerType,
            value: CornerType.ROUNDED,
          },

          granularity: {
            label: "采样角度（弧度）",
            value: Math.PI / 180,
            min: 0,
            step: Math.PI / 180,
          },
        }
      ),
    },
  })

  // 将经度、纬度、高度组合成 Cartesian3 数组
  const cartesianPositions = useMemo(
    () =>
      params.longitudeArray.map((lng, index) =>
        Cartesian3.fromDegrees(
          lng,
          params.latitudeArray[index],
          params.heightArray[index]
        )
      ),
    [params.longitudeArray, params.latitudeArray, params.heightArray]
  )

  return (
    <CorridorGraphics
      show={params.show}
      positions={cartesianPositions}
      width={params.width}
      height={params.height}
      extrudedHeight={params.extrudedHeight}
      fill={params.fill}
      material={Color.fromCssColorString(params.materialColor)}
      outline={params.outline}
      outlineColor={Color.fromCssColorString(params.outlineColor)}
      outlineWidth={params.outlineWidth}
      heightReference={params.heightReference as HeightReference}
      shadows={params.shadows as ShadowMode}
      classificationType={params.classificationType as ClassificationType}
      cornerType={params.cornerType as CornerType}
      granularity={params.granularity}
    />
  )
}

export default memo(CorridorGraphicsWithLeva)
