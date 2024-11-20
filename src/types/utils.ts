// 提取 value 的类型
type ExtractValue<T> = T extends { value: infer V } ? V : T;

// 递归映射类型：处理整个对象
export type ExtractSchema<T> = {
  [K in keyof T]: T[K] extends { value: any } ? ExtractValue<T[K]> : T[K];
};
