import { memo, useMemo } from "react"
import { ImageryLayer, type ImageryLayerProps } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"
import { UrlTemplateImageryProvider, Rectangle, type ImageryProvider } from "cesium"
import { isDev } from "@/utils/common"

const BASE_URL = import.meta.env.VITE_BASE_URL

/**
 * 预设图层配置
 */
type PresetLayerType =
  | "custom"
  | "gaode-google"
  | "openstreetmap"
  | "google-satellite"
  | "google-roadmap"
  | "bing-aerial"
  | "bing-road"
  | "cartodb-positron"
  | "cartodb-dark"

interface PresetLayerConfig {
  name: string
  url: string
  rectangle?: Rectangle
}

const PRESET_LAYERS: Record<PresetLayerType, PresetLayerConfig> = {
  custom: {
    name: "自定义",
    url: "",
  },
  "gaode-google": {
    name: "高德-Google地图",
    url: isDev
      ? "map/gaodeMap/googleMap/{z}/{x}/{y}.jpg"
      : `${BASE_URL}/map/gaodeMap/googleMap/{z}/{x}/{y}.jpg`,
    rectangle: Rectangle.fromDegrees(115.873235 - 1, 39.61691 - 1, 116.907028 + 1, 40.274956 + 1),
  },
  openstreetmap: {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
  "google-satellite": {
    name: "Google卫星图",
    url: "https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  },
  "google-roadmap": {
    name: "Google街道图",
    url: "https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  },
  "bing-aerial": {
    name: "Bing航空图",
    url: "https://ecn.t{s}.tiles.virtualearth.net/tiles/a{q}.jpeg?g=1",
  },
  "bing-road": {
    name: "Bing道路图",
    url: "https://ecn.t{s}.tiles.virtualearth.net/tiles/r{q}.jpeg?g=1",
  },
  "cartodb-positron": {
    name: "CartoDB Positron",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
  },
  "cartodb-dark": {
    name: "CartoDB Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
  },
}
// 兜底瓦片（请求失败时显示）
const fallbackTile = createFallbackTile("#357cff", 256, 256)

/**
 * 创建纯色兜底瓦片
 */
function createFallbackTile(color: string, width: number, height: number): string {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")

  if (!context) return ""

  context.fillStyle = color
  context.fillRect(0, 0, width, height)
  return canvas.toDataURL()
}

/**
 * 自定义影像图层：请求失败时返回兜底瓦片，避免黑块
 */
class CustomImageryProvider extends UrlTemplateImageryProvider {
  requestImage(x: number, y: number, level: number) {
    return super.requestImage(x, y, level).catch(() => {
      const image = new Image()
      image.src = fallbackTile
      return image
    })
  }
}

type ImageryLayerWithLevaProps = Omit<ImageryLayerProps, "imageryProvider"> & {
  /** 是否启用 Leva 调试面板 */
  enableDebug?: boolean
  /** 默认的影像提供者（当选择 custom 时使用） */
  defaultImageryProvider?: ImageryProvider
}

/**
 * 使用 Leva 控制面板包装的 ImageryLayer 组件
 * - 提供预设图层选项（OpenStreetMap、Google Maps、Bing Maps 等）
 * - 将影像图层的显示、透明度、亮度、对比度等参数暴露到调试面板
 * - 其余 props 透传给原始 ImageryLayer
 */
const ImageryLayerWithLeva = ({
  enableDebug = false,
  defaultImageryProvider,
  ...imageryLayerProps
}: ImageryLayerWithLevaProps) => {
  const params = useLevaControls(
    {
      name: "ImageryLayer",
      schema: {
        preset: folder({
          layerType: {
            label: "layerType【预设图层】",
            value: "cartodb-dark" as PresetLayerType,
            options: Object.entries(PRESET_LAYERS).reduce(
              (acc, [key, config]) => {
                acc[config.name] = key as PresetLayerType
                return acc
              },
              {} as Record<string, PresetLayerType>,
            ),
          },
        }),
        display: folder({
          show: { label: "show【显示图层】", value: true },
          alpha: { label: "alpha【透明度】", value: 1, min: 0, max: 1, step: 0.01 },
        }),
        color: folder({
          // 亮度：调整影像图层的整体亮度
          brightness: { label: "brightness【亮度】", value: 1, min: 0, max: 3, step: 0.1 },
          // 对比度：调整影像图层的明暗对比
          contrast: { label: "contrast【对比度】", value: 1, min: 0, max: 3, step: 0.1 },
          // 色调：调整影像图层的色相偏移（-180 到 180 度）
          hue: { label: "hue【色调】", value: 0, min: -180, max: 180, step: 1 },
          // 饱和度：调整影像图层的颜色饱和度
          saturation: { label: "saturation【饱和度】", value: 1, min: 0, max: 2, step: 0.1 },
          // 伽马值：调整影像图层的伽马校正值
          gamma: { label: "gamma【伽马】", value: 2, min: 0, max: 3, step: 0.1 },
        }),
      },
    },
  )

  const {
    layerType,
    show,
    alpha,
    brightness,
    contrast,
    hue,
    saturation,
    gamma,
  } = params

  const imageryProvider = useMemo(() => {
    if (layerType === "custom") {
      if (defaultImageryProvider) return defaultImageryProvider

      const fallback = PRESET_LAYERS["gaode-google"]
      if (!fallback?.url) return null

      const url = fallback.url
        .replace(/{s}/g, "0123")
        .replace(/{q}/g, "{z}/{x}/{y}")

      return new CustomImageryProvider({
        url,
        rectangle: fallback.rectangle,
      })
    }

    const preset = PRESET_LAYERS[layerType]
    if (!preset?.url) return defaultImageryProvider ?? null

    const url = preset.url
      .replace(/{s}/g, "0123")
      .replace(/{q}/g, "{z}/{x}/{y}")

    return new UrlTemplateImageryProvider({
      url,
      rectangle: preset.rectangle,
    })
  }, [layerType, defaultImageryProvider])

  if (!imageryProvider) return null

  return (
    <ImageryLayer
      {...imageryLayerProps}
      imageryProvider={imageryProvider}
      show={show}
      alpha={alpha}
      brightness={brightness}
      contrast={contrast}
      hue={hue}
      saturation={saturation}
      gamma={gamma}
    />
  )
}


export default memo(ImageryLayerWithLeva)

