// src/levaControls/treeUtils.ts
import { ControlNode } from "./store";

export function getPath(node: ControlNode, path: string[]): any {
  const [head, ...rest] = path;
  if (!head) return node;

  if (typeof node !== "object" || node === null) return undefined;

  return getPath((node as any)[head], rest);
}

export function mapNode(node, fn, path = []) {
  if (typeof node === "boolean") {
    const v = node
    return {
      value: v,
      onChange: (val) => fn(path.join('.'), val),
    }
  }

  const out = {}
  Object.entries(node).forEach(([k, v]) => {
    out[k] = mapNode(v, fn, [...path, k])
  })
  console.log(out);
  
  return out
}