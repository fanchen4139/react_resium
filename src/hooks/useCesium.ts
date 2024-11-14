import { useContext } from "react";
import { CesiumContext } from "resium";

export function useCesium() {
  const state = useContext(CesiumContext);
  // 如果 state === {}, 抛异常提示
  if (!Object.keys(state).length)
    throw new Error(
      "Resium: Hooks can only be used within the BaseResuim component!"
    );
  return state;
}
export default useCesium;
