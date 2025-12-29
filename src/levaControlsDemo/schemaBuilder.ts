// src/levaControls/schemaBuilder.ts
import { folder } from "leva";
import { ControlNode } from "./store";

export function buildSchema(node: ControlNode): any {
  
  if (typeof node === "boolean") return node;

  const entries = Object.entries(node).map(([k, v]) => {
    if (typeof v === "boolean") return [k, v];

    return [k, folder(buildSchema(v))];
  });

  return Object.fromEntries(entries);
}
