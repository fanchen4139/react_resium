/**
 * A {@link MaterialProperty} that maps to image {@link Material} uniforms.
 * @param [options] - Object with the following properties:
 * @param [options.image] - A Property specifying the Image, URL, Canvas, or Video.
 * @param [options.repeat = new Cartesian2(1.0, 1.0)] - A {@link Cartesian2} Property specifying the number of times the image repeats in each direction.
 * @param [options.color = Color.WHITE] - The color applied to the image
 * @param [options.transparent = false] - Set to true when the image has transparency (for example, when a png has transparent sections)
 */
export class WallMaterialProperty {
  constructor(options?: {
    image?:
      | Property
      | string
      | HTMLImageElement
      | HTMLCanvasElement
      | HTMLVideoElement;
    // repeat?: Property | Cartesian2;
    color?: Property | Color;
    speed?: number;
    // transparent?: Property | boolean;
  });
  /**
   * Gets a value indicating if this property is constant.  A property is considered
   * constant if getValue always returns the same result for the current definition.
   */
  readonly isConstant: boolean;
  /**
   * Gets the event that is raised whenever the definition of this property changes.
   * The definition is considered to have changed if a call to getValue would return
   * a different result for the same time.
   */
  readonly definitionChanged: Event;
  /**
   * Gets or sets the Property specifying Image, URL, Canvas, or Video to use.
   */
  image: Property | undefined;
  /**
   * Gets or sets the {@link Cartesian2} Property specifying the number of times the image repeats in each direction.
   */
  repeat: Property | undefined;
  /**
   * Gets or sets the Color Property specifying the desired color applied to the image.
   */
  color: Property | undefined;
  /**
   * Gets or sets the Boolean Property specifying whether the image has transparency
   */
  transparent: Property | undefined;
  /**
   * Gets the {@link Material} type at the provided time.
   * @param time - The time for which to retrieve the type.
   * @returns The type of material.
   */
  getType(time: JulianDate): string;
  /**
   * Gets the value of the property at the provided time.
   * @param [time = JulianDate.now()] - The time for which to retrieve the value. If omitted, the current system time is used.
   * @param [result] - The object to store the value into, if omitted, a new instance is created and returned.
   * @returns The modified result parameter or a new instance if the result parameter was not supplied.
   */
  getValue(time?: JulianDate, result?: any): any;
  /**
   * Compares this property to the provided property and returns
   * <code>true</code> if they are equal, <code>false</code> otherwise.
   * @param [other] - The other property.
   * @returns <code>true</code> if left and right are equal, <code>false</code> otherwise.
   */
  equals(other?: Property): boolean;
}
