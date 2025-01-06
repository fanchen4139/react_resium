// 线性插值
export const linear = function (t) {
  return t;
};

// 缓入 动画从缓慢开始，然后加速。
export const easeIn = function (t) {
  return t * t; // t^2
};

// 缓出 动画从快速开始，然后减速结束。
export const easeOut = function (t) {
  return t * (2 - t); // t * (2 - t)
};

// 缓入缓出 动画从缓慢开始，逐渐加速，再减速结束。
export const easeInOut = function (t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

// 弹性缓动（入）使动画有一个弹跳效果，开始时慢，结束时慢，最后产生回弹。
export const elasticIn = function (t) {
  var c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
    ? 1
    : Math.pow(2, -10 * t) * Math.sin((t - 0.1) * c4) + 1;
};

// 弹性缓动（出）在动画结束时产生弹跳效果。
export const elasticOut = function (t) {
  var c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
    ? 1
    : Math.pow(2, -10 * t) * Math.sin((t - 0.1) * c4) + 1;
};

// 反弹缓动 模拟弹跳效果，动画开始时有反弹的感觉。
export const bounceIn = function (t) {
  return 1 - bounceOut(1 - t);
};

const bounceOut = function (t) {
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  } else if (t < 2 / 2.75) {
    return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
  } else if (t < 2.5 / 2.75) {
    return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
  } else {
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  }
};

// 反向缓动（入）会让对象有一个“往回拉”的效果，在动画开始时会先有一个负的偏移量，之后才开始向目标移动。
export const backIn = function (t) {
  var s = 1.70158;
  return t * t * ((s + 1) * t - s);
};

// 反向缓动（出）结束时产生回弹效果。
export const backOut = function (t) {
  var s = 1.70158;
  return (t -= 1) * t * ((s + 1) * t + s) + 1;
};

// 指数缓动（入）开始时缓慢，随着时间逐渐加速。
export const expoIn = function (t) {
  return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
};

// 指数缓动（出）结束时加速。
export const expoOut = function (t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

// 四次方缓动（入）缓慢开始，然后加速。
export const quartIn = function (t) {
  return t * t * t * t;
};

// 四次方缓动（出）结束时加速
export const quartOut = function (t) {
  return 1 - Math.pow(1 - t, 4);
};

// 五次方缓动（入）开始时非常缓慢，逐渐加速。
export const quintIn = function (t) {
  return t * t * t * t * t;
};

// 五次方缓动（出）结束时加速。
export const quintOut = function (t) {
  return 1 - Math.pow(1 - t, 5);
};
