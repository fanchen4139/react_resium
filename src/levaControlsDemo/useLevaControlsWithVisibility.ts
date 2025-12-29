// src/levaControls/useLevaControlsWithVisibility.ts
import { useControls } from "leva";
import { useEffect, useMemo } from "react";
import { useLevaControlStore } from "./store";
import { getPath } from "./treeUtils";

export function useLevaControlsWithVisibility(
  path: string,
  schema: any
) {
  const register = useLevaControlStore((s) => s.register);
  const enabled = useLevaControlStore((s) => s.enabled);
  const controls = useLevaControlStore((s) => s.controls);

  useEffect(() => register(path), [path]);

  const visible = useMemo(
    () => getPath(controls, path.split(".")),
    [controls, path]
  );

  return useControls(
    path,
    schema,
    {
      render: () => enabled && visible !== false,
    },
    [enabled, visible]
  );
}
