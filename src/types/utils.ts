import type { SchemaToValues, Schema } from "leva/dist/declarations/src/types";

// 从 options 中提取 schema，并使用 leva 的 SchemaToValues 进行扁平化
// SchemaToValues 会自动处理 folder 的扁平化，将所有嵌套的属性提取到顶层
export type ExtractSchemaFromOptions<T> =
  T extends { schema: infer S }
    ? S extends Schema
      ? SchemaToValues<S>
      : never
    : never;