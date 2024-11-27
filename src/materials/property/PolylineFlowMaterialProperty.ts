import {
  Color,
  Event,
  Property,
  Material,
  Cartesian2,
  defaultValue,
  defined,
  // @ts-ignore
  createPropertyDescriptor,
} from "cesium";
import defaultImage from "@/assets/images/colors1.png";
type PolylineFlowMaterialOptions = {
  color?: Color;
  image?: string;
  forward?: number;
  speed?: number;
  repeat?: Cartesian2;
};

const defaultOptions: PolylineFlowMaterialOptions = {
  image: defaultImage,
  color: Color.TRANSPARENT,
  forward: 1,
  speed: 1,
  repeat: new Cartesian2(1.0, 1.0),
};

export class PolylineFlowMaterialProperty {
  // private _definitionChanged: Event;
  // private _color: Property | Color | undefined;
  // private _colorSubscription: any;
  // private _image: Property | string | undefined;
  // private _imageSubscription: any;
  // private _forward: Property | number | undefined;
  // private _forwardSubscription: any;
  // private _speed: Property | number | undefined;
  // private _speedSubscription: any;
  // private _repeat: Property | Cartesian2 | undefined;
  // private _repeatSubscription: any;

  // color: Property | Color;
  // image: Property | string;
  // forward: Property | number;
  // speed: Property | number;
  // repeat: Property | Cartesian2;

  constructor(options: PolylineFlowMaterialOptions = {}) {
    this._definitionChanged = new Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this._image = undefined;
    this._imageSubscription = undefined;
    this._forward = undefined;
    this._forwardSubscription = undefined;
    this._speed = undefined;
    this._speedSubscription = undefined;
    this._repeat = undefined;
    this._repeatSubscription = undefined;

    // Initialize the properties with default values or values from options
    this.color = options.color || defaultOptions.color; // color can be Color or Property
    this.image = options.image || defaultOptions.image; // image can be string or Property
    this.forward = options.forward || defaultOptions.forward; // forward can be number or Property
    this.speed = options.speed || defaultOptions.speed; // speed can be number or Property
    this.repeat = options.repeat || defaultOptions.repeat; // repeat can be Cartesian2 or Property

    Material._materialCache.addMaterial("PolylineFlow", {
      fabric: {
        type: "PolylineFlow",
        uniforms: {
          color: defaultOptions.color,
          image: defaultOptions.image,
          forward: defaultOptions.forward,
          speed: defaultOptions.speed,
          repeat: defaultOptions.repeat,
        },
        source: `czm_material czm_getMaterial(czm_materialInput materialInput)
        {
          czm_material material = czm_getDefaultMaterial(materialInput);
    
          vec2 st = materialInput.st;
          vec4 fragColor = texture(image, fract(vec2(st.s - speed*czm_frameNumber*0.005*forward, st.t)*repeat));
    
          material.emission = fragColor.rgb;
          material.alpha = fragColor.a;
    
          return material;
        }`,
      },
      translucent: () => true,
    });
  }

  getType(): string {
    return "PolylineFlow";
  }

  getValue(time: any, result: any = {}): any {
    if (!defined(result)) {
      result = {};
    }
    result.color = Property.getValueOrClonedDefault(
      this._color,
      time,
      defaultOptions.color,
      result.color
    );
    result.image = Property.getValueOrClonedDefault(
      this._image,
      time,
      defaultOptions.image,
      result.image
    );
    result.forward = Property.getValueOrClonedDefault(
      this._forward,
      time,
      defaultOptions.forward,
      result.forward
    );
    result.speed = Property.getValueOrClonedDefault(
      this._speed,
      time,
      defaultOptions.speed,
      result.speed
    );
    result.repeat = Property.getValueOrClonedDefault(
      this._repeat,
      time,
      defaultOptions.repeat,
      result.repeat
    );

    return result;
  }

  equals(other: any): boolean {
    return (
      this === other ||
      (other instanceof PolylineFlowMaterialProperty &&
        (Property as any).equals(this._color, other._color) &&
        (Property as any).equals(this._image, other._image) &&
        (Property as any).equals(this._forward, other._forward) &&
        (Property as any).equals(this._speed, other._speed) &&
        (Property as any).equals(this._repeat, other._repeat))
    );
  }

  get isConstant(): boolean {
    return (
      (Property as any).isConstant(this._color) &&
      (Property as any).isConstant(this._image) &&
      (Property as any).isConstant(this._forward) &&
      (Property as any).isConstant(this._speed) &&
      (Property as any).isConstant(this._repeat)
    );
  }

  get definitionChanged(): Event {
    return this._definitionChanged;
  }
}

// Define the property descriptors for each property.
Object.defineProperties(PolylineFlowMaterialProperty.prototype, {
  color: createPropertyDescriptor("color"),
  image: createPropertyDescriptor("image"),
  forward: createPropertyDescriptor("forward"),
  speed: createPropertyDescriptor("speed"),
  repeat: createPropertyDescriptor("repeat"),
});

export default PolylineFlowMaterialProperty;
