import { create } from "zustand";
import { devtools } from "zustand/middleware";

type ControlKey = string;

type ControlLeaf = boolean;

interface ControlNodeMap {
  [key: string]: ControlNode;
}

type ControlNode = ControlLeaf | ControlNodeMap;


interface LevaControlState {
  enabled: boolean;
  controls: Record<string, ControlNode>;

  register: (key: ControlKey) => void;
  setEnabled: (val: boolean) => void;
  setVisible: (key: ControlKey, val: boolean) => void;
}

/* =========================
 * helpers
 * ========================= */

/** 安全设置深层 key，不破坏已有结构 */
function setNested(
  target: Record<string, ControlNode>,
  path: string[],
  value: boolean
): Record<string, ControlNode> {
  const [head, ...rest] = path;

  // 叶子节点
  if (!head) return target;

  // clone 当前层
  const next = { ...target };

  if (rest.length === 0) {
    // 已存在则不覆盖
    if (next[head] === undefined) {
      next[head] = value;
    }
    return next;
  }

  const current =
    typeof next[head] === "object" && next[head] !== null
      ? (next[head] as Record<string, ControlNode>)
      : {};

  next[head] = setNested(current, rest, value);
  return next;
}

/** 强制设置深层 key（用于 setVisible） */
function updateNested(
  target: Record<string, ControlNode>,
  path: string[],
  value: boolean
): Record<string, ControlNode> {
  const [head, ...rest] = path;
  if (!head) return target;

  const next = { ...target };

  if (rest.length === 0) {
    next[head] = value;
    return next;
  }

  const current =
    typeof next[head] === "object" && next[head] !== null
      ? (next[head] as Record<string, ControlNode>)
      : {};

  next[head] = updateNested(current, rest, value);
  return next;
}

/* =========================
 * store
 * ========================= */

export const useLevaControlStore = create<LevaControlState>()(
  devtools(
    (set) => ({
      enabled: false,
      controls: {},

      register: (key) => set((state) => ({ controls: { ...state.controls, [key]: false } })),
        // set((state) => {
        //   const path = key.split(".");
        //   return {
        //     controls: setNested(state.controls, path, true),
        //   };
        // }),

      setEnabled: (val) => set({ enabled: val }),

      setVisible: (key, val) => set((state) => ({ controls: {...state.controls, [key]: val} }))
        // set((state) => {
        //   const path = key.split(".");
        //   return {
        //     controls: updateNested(state.controls, path, val),
        //   };
        // }),
    }),
    {
      name: "LevaControlStore",
      enabled: true,
    }
  )
);
