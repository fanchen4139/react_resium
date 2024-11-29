uniform vec4 color;
uniform float glowPower;

czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput);

    vec2 st = materialInput.st;
    float glow = glowPower / abs(st.t - 0.5) - (glowPower / 0.5);

    vec4 colorImage = texture(image, fract(vec2(st.s - speed * czm_frameNumber * 0.002 * forward, st.t) * repeat));
    vec4 fragColor;
    fragColor.rgb = max(vec3(glow - 1.0 + color.rgb), color.rgb);
    fragColor.a = clamp(0.0, 1.0, glow) * color.a;
    fragColor = czm_gammaCorrect(fragColor);

    material.alpha = colorImage.a * color.a * fragColor.a;
    material.diffuse = (colorImage.rgb + color.rgb) / 2.0;
    material.emission = fragColor.rgb;

    return material;
}