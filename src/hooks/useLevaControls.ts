import { useControls } from "leva";
import type { FolderSettings, Schema } from "leva/dist/declarations/src/types";
import type { ExtractSchemaFromOptions } from "../types/utils";
import { useLevaControlStore } from "@/store/levaControlStore";
import { useEffect, useMemo } from "react";

/* 调试器的参数 */
type ControlsOptions = {
  name: string;
  schema: Schema;
  folderSettings?: FolderSettings;
  enabled?: boolean;
};

export default function useLevaControls<S extends ControlsOptions>(
  options: S
): ExtractSchemaFromOptions<S> {
  const { name, schema } = options;
  // name 为 Leva 控制面板显示的名称（用中文注释提示当前控制项）

  const folderSettings: FolderSettings = {
    collapsed: true,
    ...options.folderSettings,
    render: () => {
      const state = useLevaControlStore.getState();
      const enabled = state.enabled;
      const visible = state.controls[name];

      return enabled && visible !== false;
    },
  };

  // 注册控制项到全局状态
  const register = useLevaControlStore((s) => s.register);
  // 获取全局状态
  const enabled = useLevaControlStore((s) => s.enabled);
  // 仅订阅当前面板的可见性，避免全量 controls 变更触发重建
  const visible = useLevaControlStore((s) => s.controls[name]);

  // 注册控制项
  useEffect(() => {
    register(name);
  }, [name, register]);

  return useControls(name, schema, folderSettings, [
    enabled,
    visible,
  ]) as ExtractSchemaFromOptions<S>;
}
