import type { Property } from "cesium";
import type { ReactNode } from "react";

export type WithChildren = {
  children: ReactNode;
};

export type DefaultControllerProps = {
  controllerName: string;
  enableDebug?: boolean;
};

export type PartialWithout<T, K extends keyof T> = Pick<T, K> &
  Partial<Omit<T, K>>;

export type RGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type CesiumImage =
  | Property
  | string
  | HTMLImageElement
  | HTMLCanvasElement
  | HTMLVideoElement;
