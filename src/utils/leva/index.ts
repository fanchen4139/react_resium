import { useControls } from "leva";
import type { FolderSettings, Schema } from "leva/dist/declarations/src/types";
import type { ExtractSchemaFromOptions } from "../../types/utils";

/* 调试器的参数 */
type ControlsOptions = {
  name: string;
  schema: Schema;
  folderSettings?: FolderSettings;
};
/* 控制面板单个控件值的结构 */
type SchemaItem =
  | number
  | string
  | boolean
  | { value: number }
  | { value: string }
  | { value: boolean };

/* 判断 item 是否包含 value 属性 */
function hasValueProperty(
  item: SchemaItem
): item is { value: number | string | boolean } {
  return typeof item === "object" && "value" in item;
}

/* 判断schema是否由 folder 函数构造 */
function getSchemaByFolder(params: Schema): Schema {
  return Object.values(params).reduce((pre, cur) => {
    if (
      // 检查值是否为 folder 包装类型
      typeof cur === "object" &&
      "schema" in cur &&
      "type" in cur &&
      "settings" in cur
    ) {
      if (
        // 优先保证对象有效
        typeof pre === "object" &&
        typeof cur.schema === "object" &&
        cur.schema !== null
      ) {
        pre = {
          ...pre,
          ...cur.schema,
        };
      }
    }
    return pre;
  }, {} as Schema);
}

/**
 * @param Object [options] - useControls 函数的参数
 * @param string [options.name] - 文件夹名称
 * @param Schema [options.schema] - 描述控制面板中控件的结构和配置
 * @param FolderSettings [options?.folderSettings] - 文件夹设置
 * @param boolean enableDebug - 是否启用调试面板
 * @returns
 */
export default function getControlsParams<S extends ControlsOptions>(
  options: S,
  enableDebug: boolean = false
): ExtractSchemaFromOptions<S> {
  let { name, schema, folderSettings } = options;
  if (!enableDebug) {
    // 判断是否由 folder 函数构造
    const folderSchema = getSchemaByFolder(schema);
    if (Object.keys(folderSchema).length) {
      schema = folderSchema;
    }
    // 遍历 schema ,将 value 提取到外层  { demo: { value: xx } } ==> { demo: xx }
    return Object.entries(schema).reduce((pre, cur: [string, SchemaItem]) => {
      const [key, value] = cur;
      pre[key] = hasValueProperty(value) ? value.value : value;
      return pre;
    }, {} as ExtractSchemaFromOptions<S>);
  } else {
    return useControls(
      name,
      schema,
      folderSettings
    ) as ExtractSchemaFromOptions<S>;
  }
}
