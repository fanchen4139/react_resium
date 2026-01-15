import { memo, useMemo } from "react"
import { SkyAtmosphere } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { Cartesian3 } from "cesium"
import { folder } from "leva"

/**
 * SkyAtmosphereWithLeva
 * - 用 Leva 控制 SkyAtmosphere 属性
 * - 需放在 <Viewer> 或 <CesiumWidget> 内使用
 */
const SkyAtmosphereWithLeva = () => {
  const params = useLevaControls({
    name: "SkyAtmosphere 控制",
    schema: {
      basic: folder(
        {
          show: { label: "显示 show", value: true },
          perFragmentAtmosphere: {
            label: "逐片元渲染 perFragment",
            value: true,
          },
          atmosphereLightIntensity: {
            label: "光照强度",
            value: 10,
            min: 0,
            max: 50,
            step: 0.1,
          },
        },
        { collapsed: false }
      ),

      colorShift: folder(
        {
          hueShift: {
            label: "色相偏移 hueShift",
            value: 0,
            min: -1,
            max: 1,
            step: 0.01,
          },
          saturationShift: {
            label: "饱和度偏移 saturationShift",
            value: 0,
            min: -1,
            max: 1,
            step: 0.01,
          },
          brightnessShift: {
            label: "亮度偏移 brightnessShift",
            value: 0,
            min: -1,
            max: 1,
            step: 0.01,
          },
        },
        { collapsed: false }
      ),

      rayleigh: folder(
        {
          rayleighX: {
            label: "Rayleigh X",
            value: 5.8e-6,
            step: 1e-7,
          },
          rayleighY: {
            label: "Rayleigh Y",
            value: 13.5e-6,
            step: 1e-7,
          },
          rayleighZ: {
            label: "Rayleigh Z",
            value: 33.1e-6,
            step: 1e-7,
          },
          atmosphereRayleighScaleHeight: {
            label: "Rayleigh ScaleHeight",
            value: 8000,
            min: 0,
            step: 100,
          },
        },
        { collapsed: true }
      ),

      mie: folder(
        {
          mieX: {
            label: "Mie X",
            value: 21e-6,
            step: 1e-7,
          },
          mieY: {
            label: "Mie Y",
            value: 21e-6,
            step: 1e-7,
          },
          mieZ: {
            label: "Mie Z",
            value: 21e-6,
            step: 1e-7,
          },
          atmosphereMieScaleHeight: {
            label: "Mie ScaleHeight",
            value: 1200,
            min: 0,
            step: 50,
          },
          atmosphereMieAnisotropy: {
            label: "Mie Anisotropy",
            value: 0.9,
            min: -1,
            max: 1,
            step: 0.01,
          },
        },
        { collapsed: true }
      ),
    },
  })

  const atmosphereRayleighCoefficient = useMemo(
    () => new Cartesian3(params.rayleighX, params.rayleighY, params.rayleighZ),
    [params.rayleighX, params.rayleighY, params.rayleighZ]
  )

  const atmosphereMieCoefficient = useMemo(
    () => new Cartesian3(params.mieX, params.mieY, params.mieZ),
    [params.mieX, params.mieY, params.mieZ]
  )

  return (
    <SkyAtmosphere
      show={params.show}
      perFragmentAtmosphere={params.perFragmentAtmosphere}
      atmosphereLightIntensity={params.atmosphereLightIntensity}
      hueShift={params.hueShift}
      saturationShift={params.saturationShift}
      brightnessShift={params.brightnessShift}
      atmosphereRayleighCoefficient={atmosphereRayleighCoefficient}
      atmosphereRayleighScaleHeight={params.atmosphereRayleighScaleHeight}
      atmosphereMieCoefficient={atmosphereMieCoefficient}
      atmosphereMieScaleHeight={params.atmosphereMieScaleHeight}
      atmosphereMieAnisotropy={params.atmosphereMieAnisotropy}
    />
  )
}

export default memo(SkyAtmosphereWithLeva)
