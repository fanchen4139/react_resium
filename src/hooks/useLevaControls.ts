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
};

export default function useLevaControls<S extends ControlsOptions>(
  options: S
): ExtractSchemaFromOptions<S> {
  const { name, schema } = options;

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
  // 获取各控制项的可见性状态
  const controls = useLevaControlStore((s) => s.controls);

  // 注册控制项
  useEffect(() => {
    register(name);
  }, [name, register]);

  return useControls(name, schema, folderSettings, [
    enabled,
    controls,
  ]) as ExtractSchemaFromOptions<S>;
}
