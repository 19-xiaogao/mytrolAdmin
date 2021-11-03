const TOKEN = "TOKEN";
/**
 * 节流
 * @param fn
 * @param delay
 */
export function throttle(fn, delay = 3000) {
  let timer = null;
  let startTime;
  return function(...args) {
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

export const setStorageToken = (value) => {
  localStorage.setItem(TOKEN, value);
};

export const getStorageToken = () => {
  const value = localStorage.getItem(TOKEN);
  if (value !== null && value !== "") {
    return value;
  }
  return null;
};

export const removeStorageToken = () => {
  localStorage.removeItem(TOKEN);
};
