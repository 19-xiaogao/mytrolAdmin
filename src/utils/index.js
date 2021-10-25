/**
 * 节流
 * @param fn
 * @param delay
 */
export function throttle(fn, delay = 3000) {
  let timer = null;
  let startTime;
  return function(...args) {
    // @ts-ignore
    const ctx = this;
    const now = Date.now();
    if (startTime && now < startTime + delay) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        startTime = now;
        fn.apply(ctx, args);
      }, delay);
    } else {
      startTime = now;
      fn.apply(ctx, args);
    }
  };
}
