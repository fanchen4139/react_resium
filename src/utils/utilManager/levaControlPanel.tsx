import { useLevaControlStore } from "@/store/levaControlStore";
import { useControls, folder, useCreateStore, Leva, LevaPanel } from "leva";
import { useMemo } from "react";

export default function LevaControlPanel() {
  const debugStore = useCreateStore()

  const enabled = useLevaControlStore((s) => s.enabled);
  const controls = useLevaControlStore((s) => s.controls);
  const setEnabled = useLevaControlStore((s) => s.setEnabled);
  const setVisible = useLevaControlStore((s) => s.setVisible);

  const schema = useMemo(() => {
    if (!enabled) {
      return {
        enabled: {
          value: enabled,
          onChange: (v: boolean) => setEnabled(v),
        },
      }
    }
    return {
      enabled: {
        value: enabled,
        onChange: (v: boolean) => setEnabled(v),
      },

      Controls: folder(
        Object.fromEntries(
          Object.entries(controls).map(([key, value]) => [
            key,
            {
              value,
              onChange: (v: boolean) => setVisible(key, v),
            },
          ])
        ),
        { collapsed: false }
      ),
    };
  }, [enabled, controls, setEnabled, setVisible]);

  useControls(
    "Leva Manager",
    schema,
    { collapsed: false, store: debugStore },
    [enabled, controls]
  );
  return <div style={{
    // display: 'grid',
    width: 300,
    // gap: 10,
    // paddingBottom: 40,
    // marginRight: 10,
    position: 'relative',
    top: 50,
    zIndex: 1,
    float: 'left',
  }}>
    <LevaPanel fill flat store={debugStore} />
    {/* <LevaPanel fill flat titleBar={false} store={fontWeightsStore} /> */}
  </div>

  return <div style={{
    display: 'flex',
    float: 'left',
    width: 300,
    height: 300
  }}>
  </div>;
}
