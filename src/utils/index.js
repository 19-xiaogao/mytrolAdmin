const TOKEN = "ROLE";
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

//storage func
export const setStorageRole = (value) => {
  localStorage.setItem(TOKEN, value);
};

export const getStorageRole = () => {
  const value = localStorage.getItem(TOKEN);
  if (value !== null && value !== "") {
    return value;
  }
  return null;
};

export const removeStorageRole = () => {
  localStorage.removeItem(TOKEN);
};

/*
 * 将file对象转化为base64编码
 * file  目标file对象
 */
export function previewFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = () => reject(reader.error);
  });
}
// splitAllUrl

export const joinPreviewUrl = (hash) => {
  return process.env.VUE_APP_BASE_IPFS + hash;
};
