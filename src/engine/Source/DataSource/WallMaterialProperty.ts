import type { CesiumImage } from "@/types/Common";
import {
  Color,
  Event,
  Property,
  Material,
  Cartesian2,
  defined,
  createPropertyDescriptor,
  JulianDate,
  ConstantProperty,
} from "cesium";

/* =========================
 * Shader Type
 * ========================= */

export enum WallFlowShader {
  Up = "WallFlowUp",
  Down = "WallFlowDown",
  Clockwise = "WallFlowClockwise",
  Counterclockwise = "WallFlowCounterclockwise",
}

/* =========================
 * Options
 * ========================= */

export type WallFlowMaterialOptions = {
  color?: Property | Color;
  image?: CesiumImage;
  speed?: Property | number;
  repeat?: Property | Cartesian2;
  shaderType?: WallFlowShader;
};

/* =========================
 * Defaults
 * ========================= */

const DEFAULT_COLOR = Color.WHITE;
const DEFAULT_IMAGE = Material.DefaultImageId;
const DEFAULT_SPEED = 1.0;
const DEFAULT_REPEAT = new Cartesian2(1, 1);
const DEFAULT_SHADER = WallFlowShader.Clockwise;

/* =========================
 * Cesium Property helpers
 * ========================= */

const CesiumProperty = Property as any;

function getCesiumValue<T>(
  prop: Property | undefined,
  time: JulianDate,
  defaultValue: T,
  result?: T
): T {
  if (defined(prop)) {
    return CesiumProperty.getValueOrClonedDefault(
      prop,
      time,
      defaultValue,
      result
    );
  }
  return defaultValue;
}

/* =========================
 * Class
 * ========================= */

export default class WallFlowMaterialProperty implements Property {
  /* ===== Cesium required ===== */

  readonly _definitionChanged = new Event();

  /* ===== internal storage ===== */

  private _color?: Property;
  private _speed?: Property;
  private _repeat?: Property;

  // sampler2D：不是 Property
  private _image: CesiumImage;

  // Material.type
  private _shaderType: WallFlowShader;

  private static _timeScratch = new JulianDate();

  constructor(options: WallFlowMaterialOptions = {}) {
    this._color = new ConstantProperty(options.color ?? DEFAULT_COLOR);
    this._speed = new ConstantProperty(options.speed ?? DEFAULT_SPEED);
    this._repeat = new ConstantProperty(options.repeat ?? DEFAULT_REPEAT);

    this._image = options.image ?? DEFAULT_IMAGE;
    this._shaderType = options.shaderType ?? DEFAULT_SHADER;
  }

  /* =========================
   * Cesium Property interface
   * ========================= */

  get isConstant(): boolean {
    return (
      CesiumProperty.isConstant(this._color) &&
      CesiumProperty.isConstant(this._speed) &&
      CesiumProperty.isConstant(this._repeat)
      // image / shaderType are treated as static
    );
  }

  get definitionChanged(): Event {
    return this._definitionChanged;
  }

  /** Material.type */
  getType(): string {
    return this._shaderType;
  }

  getValue(
    time?: JulianDate,
    result: Record<string, any> = {}
  ): Record<string, any> {
    if (!defined(time)) {
      time = JulianDate.now(WallFlowMaterialProperty._timeScratch);
    }

    result.color = getCesiumValue(
      this._color,
      time,
      DEFAULT_COLOR,
      result.color
    );

    result.speed = getCesiumValue(
      this._speed,
      time,
      DEFAULT_SPEED,
      result.speed
    );

    result.repeat = getCesiumValue(
      this._repeat,
      time,
      DEFAULT_REPEAT,
      result.repeat
    );

    // sampler2D 直接赋值
    result.image = this._image;

    return result;
  }

  equals(other?: Property): boolean {
    return (
      this === other ||
      (other instanceof WallFlowMaterialProperty &&
        CesiumProperty.equals(this._color, other._color) &&
        CesiumProperty.equals(this._speed, other._speed) &&
        CesiumProperty.equals(this._repeat, other._repeat) &&
        this._image === other._image &&
        this._shaderType === other._shaderType)
    );
  }

  /* =========================
   * Extra public accessors
   * ========================= */

  get image(): CesiumImage {
    return this._image;
  }

  set image(value: CesiumImage) {
    if (this._image !== value) {
      this._image = value;
      this._definitionChanged.raiseEvent(this);
    }
  }

  get shaderType(): WallFlowShader {
    return this._shaderType;
  }

  set shaderType(value: WallFlowShader) {
    if (this._shaderType !== value) {
      this._shaderType = value;
      // Material.type change → force material rebuild
      this._definitionChanged.raiseEvent(this);
    }
  }
}

/* =========================
 * Property descriptors
 * ========================= */

Object.defineProperties(WallFlowMaterialProperty.prototype, {
  color: createPropertyDescriptor("color"),
  speed: createPropertyDescriptor("speed"),
  repeat: createPropertyDescriptor("repeat"),
});
