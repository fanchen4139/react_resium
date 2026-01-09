import { memo, useMemo } from "react"
import { CloudCollection } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { Cartesian3 } from "cesium"

/**
 * CloudCollectionWithLeva
 * - 使用 Leva 面板动态调试 CloudCollection 属性
 * - 需放在 <Viewer> 或 <CesiumWidget> 内
 */
const CloudCollectionWithLeva = () => {
  const params = useLevaControls({
    name: "CloudCollection 控制",
    schema: {
      show: { label: "显示 show", value: true },
      noiseDetail: {
        label: "噪声细节 noiseDetail",
        value: 16,
        min: 8,
        max: 32,
        step: 8, // 8, 16, 32 等 POW2
      },
      noiseOffsetX: {
        label: "噪声偏移 X",
        value: 0,
        step: 1,
      },
      noiseOffsetY: {
        label: "噪声偏移 Y",
        value: 0,
        step: 1,
      },
      noiseOffsetZ: {
        label: "噪声偏移 Z",
        value: 0,
        step: 1,
      },
      debugBillboards: {
        label: "调试 显示广告板",
        value: false,
      },
      debugEllipsoids: {
        label: "调试 显示椭球体",
        value: false,
      },
    },
  })

  // 使用 Cartesian3 组合噪声坐标
  const noiseOffset = useMemo(
    () =>
      new Cartesian3(
        params.noiseOffsetX,
        params.noiseOffsetY,
        params.noiseOffsetZ
      ),
    [
      params.noiseOffsetX,
      params.noiseOffsetY,
      params.noiseOffsetZ,
    ]
  )

  return (
    <CloudCollection
      show={params.show}
      noiseDetail={params.noiseDetail}
      noiseOffset={noiseOffset}
      debugBillboards={params.debugBillboards}
      debugEllipsoids={params.debugEllipsoids}
    />
  )
}

export default memo(CloudCollectionWithLeva)
