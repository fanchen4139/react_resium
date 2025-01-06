czm_material czm_getMaterial(czm_materialInput materialInput) {
    czm_material material = czm_getDefaultMaterial(materialInput);

    // 缩放纹理坐标，并应用横向和纵向的重复次数
    vec2 st = materialInput.st * vec2(repeat.x, repeat.y);

    // 顺时针流动，使用动画坐标来采样纹理
    vec4 colorImage = texture(image, vec2(fract(st.s + speed * czm_frameNumber * 0.005), st.t));

    // 设置材质的漫反射颜色，将纹理的 RGB 值应用到漫反射
    material.diffuse = colorImage.rgb;

    // 设置材质的发光颜色，使用纹理的颜色
    // material.emission = colorImage.rgb;

    // 强制设置 alpha 为 1.0，忽略纹理的 alpha 通道
    material.alpha = colorImage.a;

    // 返回修改后的材质
    return material;
}
