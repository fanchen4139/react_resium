import type { FolderInput } from "leva/dist/declarations/src/types";

// 递归提取值
type ExtractValues<T> = {
  [K in keyof T]: T[K] extends { value: infer V } ? V : T[K];
};

// 提取 schema 结构
type ExtractSchema<T> = T extends { [K in keyof T]: infer V }
  ? V extends FolderInput<infer InearSchema>
    ? ExtractValues<InearSchema> // 剔除 folder 外层结构
    : { [K in keyof T]: T[K] extends { value: infer IV } ? IV : T[K] }
  : never;

// 从 options 中提取 schema
export type ExtractSchemaFromOptions<T> = T extends { schema: infer V }
  ? ExtractSchema<V>
  : never;
