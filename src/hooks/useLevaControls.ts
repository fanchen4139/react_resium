import { useControls } from "leva";
import type { FolderSettings, Schema } from "leva/dist/declarations/src/types";
import type { ExtractSchemaFromOptions } from "../types/utils";

/* 调试器的参数 */
type ControlsOptions = {
  name: string;
  schema: Schema;
  folderSettings?: FolderSettings;
};

/**
 * 非调试模式下，提取 schema 的各项 value ，使其结构与 useControls 的返回值保持一致
 * @param string [key] - 控制面板 value 值实际对应的键
 * @param any [value] - 默认值
 * @param Object result - 默认参数对象
 */
function schemaToValues(key, value, result) {
  if (typeof value === "object" && "schema" in value) {
    Object.entries(value.schema).forEach(([key, value]) => {
      schemaToValues(key, value, result);
    });
  } else if (typeof value === "object" && "value" in value) {
    result[key] = value.value;
  } else {
    result[key] = value;
  }
}

/**
 * 根据 options.schema 构建默认参数，enableDebug 控制是否启用调试面板
 * @param Object [options] - useControls 函数的参数
 * @param string [options.name] - 文件夹名称
 * @param Schema [options.schema] - 描述控制面板中控件的结构和配置
 * @param FolderSettings [options?.folderSettings] - 文件夹设置
 * @param boolean enableDebug - 是否启用调试面板
 * @return 默认参数
 */
export default function useLevaControls<S extends ControlsOptions>(
  options: S,
  enableDebug: boolean = false
): ExtractSchemaFromOptions<S> {
  const { name, schema, folderSettings = { collapsed: true } } = options;
  if (!enableDebug) {
    return Object.entries(schema).reduce((pre, cur) => {
      const [key, value] = cur;
      schemaToValues(key, value, pre);
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
