// src/levaControls/store.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
type ControlKey = string;

type ControlLeaf = boolean;

interface ControlNodeMap {
  [key: string]: ControlNode;
}

export type ControlNode = ControlLeaf | ControlNodeMap;

// export type ControlNode = boolean | Record<string, ControlNode>;

export interface LevaControlState {
  enabled: boolean;
  controls: Record<string, ControlNode>;

  register(path: string): void;
  setEnabled(v: boolean): void;
  setVisible(path: string, v: boolean): void;
}

function insertPath(
  target: Record<string, ControlNode>,
  path: string[]
): Record<string, ControlNode> {
  if (!path.length) return target;

  const [head, ...rest] = path;
  const next = { ...target };

  if (!rest.length) {
    if (next[head] === undefined) next[head] = true;
    return next;
  }

  const child =
    typeof next[head] === "object" && next[head] !== null
      ? (next[head] as Record<string, ControlNode>)
      : {};

  next[head] = insertPath(child, rest);
  return next;
}

function updatePath(
  target: Record<string, ControlNode>,
  path: string[],
  value: boolean
): Record<string, ControlNode> {
  const [head, ...rest] = path;
  const next = { ...target };

  if (!rest.length) {
    next[head] = value;
    return next;
  }

  const child =
    typeof next[head] === "object" && next[head] !== null
      ? (next[head] as Record<string, ControlNode>)
      : {};

  next[head] = updatePath(child, rest, value);
  return next;
}

export const useLevaControlStore = create<LevaControlState>()(
  devtools(
    (set) => ({
      enabled: false,
      controls: {},

      register: (key) =>
        set((s) => ({
          controls: insertPath(s.controls, key.split(".")),
        })),

      setEnabled: (v) => {
        console.log(89898989);
        set({ enabled: v })
      },

      setVisible: (key, v) => {
        console.log(9090);
        set((s) => ({
          controls: updatePath(s.controls, key.split("."), v),
        }))
        
      }
        ,
    }),
    { name: "LevaControlStore" }
  )
);
