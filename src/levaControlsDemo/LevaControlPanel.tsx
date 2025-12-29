// src/levaControls/LevaControlPanel.tsx
import {
  useCreateStore,
  useControls,
  folder,
  LevaPanel,
} from "leva";
import { useMemo } from "react";
import { buildSchema } from "./schemaBuilder";
import { mapNode } from "./treeUtils";
import { useLevaControlStore } from "./store";

export default function LevaControlPanel() {
  const store = useCreateStore();

  const { enabled, controls, setEnabled, setVisible } = useLevaControlStore();

  const schema = useMemo(() => ({
  enabled: {
    value: enabled,
    onChange: setEnabled,
  },
  Controls: enabled
    ? folder(
        mapNode(controls, (path, v) => setVisible(path, v)),
        { collapsed: false }
      )
    : folder({})
}), [enabled, controls])

  useControls("Manager", schema, {
    collapsed: false,
    store,
  }, [ enabled, JSON.stringify(controls) ]);

  return (
    <div
      style={{
        width: 300,
        position: "relative",
        top: 50,
        zIndex: 1,
        float: "left",
      }}
    >
      <LevaPanel store={store} fill flat />
    </div>
  );
}
