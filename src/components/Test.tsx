import { useEffect } from "react";
import { useCesium } from "../hooks/useCesium";
import { useFrame } from "../hooks/useFrame";

export default function Test() {

    const state = useCesium()
    useEffect(() => {
        // console.log(state);
    }, [])
    useFrame((state) => {
        const { camera } = state
        // camera.position.y += 10
    })
    return null
}