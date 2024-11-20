import { useControls } from "leva";
import type { FolderSettings, Schema } from "leva/dist/declarations/src/types";
import type { ExtractSchema } from "../../types/utils";

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

/**
 * @param Object [options] - useControls 函数的参数
 * @param string [options.name] - 文件夹名称
 * @param Schema [options.schema] - 描述控制面板中控件的结构和配置
 * @param FolderSettings [options?.folderSettings] - 文件夹设置
 * @param boolean enableDebug - 是否启用调试面板
 * @returns
 */
export default function getControlsParams<S>(
  options: ControlsOptions,
  enableDebug: boolean = false
): ExtractSchema<S> {
  const { name, schema, folderSettings } = options;
  if (!enableDebug) {
    return Object.entries(schema).reduce((pre, cur: [string, SchemaItem]) => {
      const [key, value] = cur;
      pre[key] = hasValueProperty(value) ? value.value : value;
      return pre;
    }, {} as ExtractSchema<S>); // 这里显式指定类型
  } else {
    return useControls(name, schema, folderSettings) as ExtractSchema<S>;
  }
}
