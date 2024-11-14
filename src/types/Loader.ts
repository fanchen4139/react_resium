export enum Loader {
  /** 加载 .gltf文件（广泛使用的 3D 模型格式，包含模型、材质、动画等信息）。 */
    'GLTF' = 'GLTF',
  /** 加载 .glb 文件（广泛使用的 3D 模型格式，包含模型、材质、动画等信息）。 */
    'GLB' = 'GLB',
  /** 加载 .fbx 文件格式，通常包含动画等信息，广泛用于 3D 动画。 */
    'FBX' = 'FBX',
  /** 加载 .obj 格式文件，适合简单的几何模型，常与 .mtl 材质文件结合使用。 */
    'OBJ' = 'OBJ',
  /** 用于加载纹理贴图，可用于材质的 map 属性。
   * （如 常见格式有.jpg、.jpeg、.png、.bmp，以及 WebGL 常用的压缩纹理格式如 .ktx 和 .basis）*/
    'Texture' = 'Texture',
  /** 加载 .stl 文件（常用于 CAD 文件），适合工程类和打印模型。 */
    'STL' = 'STL',
  /** .drc（Draco 独立文件），也可以作为 .gltf 和 .glb 的嵌入压缩格式
   *  解码压缩过的 glTF 模型，提升加载速度。 */
    'DRACO' = 'DRACO',
  /** 加载 .usdz 文件，常用于增强现实（AR）应用。 */
    'USDZ' = 'USDZ',
  /** 加载 .ply 格式文件，常用于点云数据和扫描数据。 */
    'PLY' = 'PLY',
  /** 加载 .dae 格式文件（包含动画和材质的通用文件格式）。 */
    'Collada' = 'Collada',
}

export type LoaderSet =
  Loader.GLTF |
  Loader.GLB |
  Loader.FBX |
  Loader.OBJ |
  Loader.Texture |
  Loader.STL |
  Loader.DRACO |
  Loader.USDZ |
  Loader.PLY |
  Loader.Collada