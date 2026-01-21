import { memo, useMemo } from "react"
import { ImageryLayer, type ImageryLayerProps } from "resium"
import useLevaControls from "@/hooks/useLevaControls"
import { folder } from "leva"
import {
  BingMapsImageryProvider,
  Color,
  Rectangle,
  SplitDirection,
  TextureMagnificationFilter,
  TextureMinificationFilter,
  UrlTemplateImageryProvider,
  type ImageryProvider,
} from "cesium"
import { isDev } from "@/utils/common"

const BASE_URL = import.meta.env.VITE_BASE_URL

// 预设图层类型的枚举
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

// 预设图层配置接口
interface PresetLayerConfig {
  name: string // 图层名称
  url: string // 图层的瓦片 URL
  rectangle?: Rectangle // 可选的图层显示区域
  subdomains?: string[] | string // 可选的子域列表
  useQuadKey?: boolean // 是否使用 Bing quadkey
}

// 定义预设图层配置对象，包含不同图层的URL和显示区域
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
    subdomains: ["a", "b", "c"],
  },
  "google-satellite": {
    name: "Google卫星图",
    url: "https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    subdomains: ["0", "1", "2", "3"],
  },
  "google-roadmap": {
    name: "Google街道图",
    url: "https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    subdomains: ["0", "1", "2", "3"],
  },
  "bing-aerial": {
    name: "Bing航空图",
    url: "https://ecn.t{s}.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=1",
    subdomains: ["0", "1", "2", "3", "4"],
    useQuadKey: true,
  },
  "bing-road": {
    name: "Bing道路图",
    url: "https://ecn.t{s}.tiles.virtualearth.net/tiles/r{quadkey}.jpeg?g=1",
    subdomains: ["0", "1", "2", "3", "4"],
    useQuadKey: true,
  },
  "cartodb-positron": {
    name: "CartoDB Positron",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    subdomains: ["a", "b", "c", "d"],
  },
  "cartodb-dark": {
    name: "CartoDB Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
    subdomains: ["a", "b", "c", "d"],
  },
}

// 兜底瓦片（请求失败时显示的图层）
const fallbackTile = createFallbackTile("#357cff", 256, 256)

/**
 * 创建纯色兜底瓦片
 * @param color - 兜底瓦片的颜色
 * @param width - 兜底瓦片的宽度
 * @param height - 兜底瓦片的高度
 */
function createFallbackTile(color: string, width: number, height: number): string {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")
  
  if (!context) return "" // 如果获取上下文失败，则返回空字符串
  
  context.fillStyle = color
  context.fillRect(0, 0, width, height)
  return canvas.toDataURL() // 返回生成的纯色图像
}

/**
 * 自定义影像图层：请求失败时返回兜底瓦片，避免黑块显示
 * 继承自 UrlTemplateImageryProvider，重写 requestImage 方法以处理失败的请求
 */
class CustomImageryProvider extends UrlTemplateImageryProvider {
  /**
   * 重写请求图像的方法，处理图像请求失败的情况
   * @param x - 瓦片的 x 坐标
   * @param y - 瓦片的 y 坐标
   * @param level - 瓦片的缩放级别
   */
  requestImage(x: number, y: number, level: number) {
    return super.requestImage(x, y, level).catch(() => {
      // 请求失败时，返回一个纯色兜底瓦片
      const image = new Image()
      image.src = fallbackTile
      return image
    })
  }
}

type ImageryLayerWithLevaProps = Omit<ImageryLayerProps, "imageryProvider"> & {
  defaultImageryProvider?: ImageryProvider // 默认影像提供者，当选择 custom 时使用
}

/**
 * 使用 Leva 控制面板包装的 ImageryLayer 组件
 * - 提供预设图层选项（OpenStreetMap、Google Maps、Bing Maps 等）
 * - 将影像图层的显示、透明度、亮度、对比度等参数暴露到调试面板
 * - 其余 props 透传给原始 ImageryLayer
 */
const ImageryLayerWithLeva = ({
  defaultImageryProvider,
  ...imageryLayerProps
}: ImageryLayerWithLevaProps) => {
  // 使用 Leva 控制面板定义图层的控制选项
  const params = useLevaControls(
    {
      name: "ImageryLayer",
      schema: {
        preset: folder({
          layerType: {
            label: "layerType【预设图层】", // 图层类型选择
            value: "cartodb-dark" as PresetLayerType,
            options: useMemo(() => Object.entries(PRESET_LAYERS).reduce(
              (acc, [key, config]) => {
                acc[config.name] = key as PresetLayerType
                return acc
              },
              {} as Record<string, PresetLayerType>
            ), []), // 使用 useMemo 优化选项计算，避免重复计算
          },
        }),
        display: folder({
          show: { label: "show【显示图层】", value: true }, // 控制图层是否显示
          alpha: { label: "alpha【透明度】", value: 1, min: 0, max: 1, step: 0.01 }, // 图层透明度
          index: { label: "index【顺序】", value: 0, step: 1 },
          splitDirection: {
            label: "splitDirection【分屏】",
            value: SplitDirection.NONE,
            options: {
              NONE: SplitDirection.NONE,
              LEFT: SplitDirection.LEFT,
              RIGHT: SplitDirection.RIGHT,
            },
          },
        }),
        color: folder({
          brightness: { label: "brightness【亮度】", value: 1, min: 0, max: 3, step: 0.1 }, // 亮度控制
          contrast: { label: "contrast【对比度】", value: 1, min: 0, max: 3, step: 0.1 }, // 对比度控制
          hue: { label: "hue【色调】", value: 0, min: -180, max: 180, step: 1 }, // 色调控制
          saturation: { label: "saturation【饱和度】", value: 1, min: 0, max: 2, step: 0.1 }, // 饱和度控制
          gamma: { label: "gamma【伽马】", value: 2, min: 0, max: 3, step: 0.1 }, // 伽马控制
          dayAlpha: { label: "dayAlpha【日间透明度】", value: 1, min: 0, max: 1, step: 0.01 },
          nightAlpha: { label: "nightAlpha【夜间透明度】", value: 1, min: 0, max: 1, step: 0.01 },
          colorToAlpha: { label: "colorToAlpha【颜色转透明】", value: "#000000" },
          colorToAlphaThreshold: { label: "colorToAlphaThreshold【颜色透明阈值】", value: 0, min: 0, max: 1, step: 0.01 },
        }),
        filter: folder({
          minificationFilter: {
            label: "minificationFilter【缩小过滤器】",
            value: TextureMinificationFilter.LINEAR,
            options: {
              NEAREST: TextureMinificationFilter.NEAREST,
              LINEAR: TextureMinificationFilter.LINEAR,
              NEAREST_MIPMAP_NEAREST: TextureMinificationFilter.NEAREST_MIPMAP_NEAREST,
              LINEAR_MIPMAP_NEAREST: TextureMinificationFilter.LINEAR_MIPMAP_NEAREST,
              NEAREST_MIPMAP_LINEAR: TextureMinificationFilter.NEAREST_MIPMAP_LINEAR,
              LINEAR_MIPMAP_LINEAR: TextureMinificationFilter.LINEAR_MIPMAP_LINEAR,
            },
          },
          magnificationFilter: {
            label: "magnificationFilter【放大过滤器】",
            value: TextureMagnificationFilter.LINEAR,
            options: {
              NEAREST: TextureMagnificationFilter.NEAREST,
              LINEAR: TextureMagnificationFilter.LINEAR,
            },
          },
        }),
        cutout: folder({
          useCutoutRectangle: { label: "cutoutRectangle【裁剪矩形】", value: false },
          west: { label: "west【西】", value: 115, step: 0.00001 },
          south: { label: "south【南】", value: 38, step: 0.00001 },
          east: { label: "east【东】", value: 117, step: 0.00001 },
          north: { label: "north【北】", value: 40, step: 0.00001 },
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
    dayAlpha,
    nightAlpha,
    colorToAlpha,
    colorToAlphaThreshold,
    splitDirection,
    minificationFilter,
    magnificationFilter,
    index,
    useCutoutRectangle,
    west,
    south,
    east,
    north,
  } = params
  const layerTypeKey = (typeof layerType === "string" ? layerType : String(layerType)) as PresetLayerType

  // 根据选定的图层类型创建对应的 ImageryProvider
  const imageryProvider = useMemo(() => {
    if (layerTypeKey === "custom") {
      if (defaultImageryProvider) return defaultImageryProvider // 如果选择了自定义图层，使用默认提供者

      const fallback = PRESET_LAYERS["gaode-google"]
      if (!fallback?.url) return null // 如果没有默认URL，则返回null

      return new CustomImageryProvider({
        url: fallback.url,
        rectangle: fallback.rectangle,
        subdomains: fallback.subdomains,
        customTags: fallback.useQuadKey ? {
          quadkey: (provider, x, y, level) => BingMapsImageryProvider.tileXYToQuadKey(x, y, level),
        } : undefined,
      })
    }

    const preset = PRESET_LAYERS[layerTypeKey] // 根据选择的预设图层获取配置
    if (!preset?.url) return defaultImageryProvider ?? null // 如果没有配置URL，返回默认提供者

    return new UrlTemplateImageryProvider({
      url: preset.url,
      rectangle: preset.rectangle,
      subdomains: preset.subdomains,
      customTags: preset.useQuadKey ? {
        quadkey: (provider, x, y, level) => BingMapsImageryProvider.tileXYToQuadKey(x, y, level),
      } : undefined,
    })
  }, [layerTypeKey, defaultImageryProvider]) // 依赖 layerType 和 defaultImageryProvider

  const cutoutRectangle = useMemo(() => {
    if (!useCutoutRectangle) return undefined
    return Rectangle.fromDegrees(west, south, east, north)
  }, [useCutoutRectangle, west, south, east, north])

  // 如果没有有效的 imageryProvider，则不渲染图层
  if (!imageryProvider) return null

  // 渲染 ImageryLayer 组件，并传递控制面板中的参数
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
      dayAlpha={dayAlpha}
      nightAlpha={nightAlpha}
      colorToAlpha={Color.fromCssColorString(colorToAlpha)}
      colorToAlphaThreshold={colorToAlphaThreshold}
      splitDirection={splitDirection}
      minificationFilter={minificationFilter}
      magnificationFilter={magnificationFilter}
      index={index}
      cutoutRectangle={cutoutRectangle}
    />
  )
}

export default memo(ImageryLayerWithLeva)
