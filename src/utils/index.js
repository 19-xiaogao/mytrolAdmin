import { notification } from "ant-design-vue";
import { v4 as uuid } from "uuid";
import sha256 from "sha256";
const TOKEN = "ROLE";
/**
 * 节流
 * @param fn
 * @param delay
 */
export function throttle(fn, delay = 3000) {
  let timer = null;
  let startTime;
  return function (...args) {
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

// 拼接ipfs请求路径 ，图片都是用oss,避免过大改动...
export const joinPreviewUrl = (url) => {
  // return process.env.VUE_APP_BASE_IPFS + url;
  return url;
};

// 提示框
export function notify(message, description, type = "info", duration = 4.5) {
  notification[type]({ message, description, duration });
}

export function infoNotify(description) {
  notification.info({
    message: "Notice~",
    description,
  });
}

export function successNotify(description) {
  notification.success({
    message: "提示~",
    description,
  });
}

export function warningNotify(description) {
  notification.warning({
    message: "提示~",
    description,
  });
}

export function errorNotify(description, message = "有些错误~") {
  notification.error({
    message,
    description,
  });
}

// sort运营列表
export function sortOperation(operationList) {
  const onList = operationList.filter((item) => item.status === "on");
  const offList = operationList.filter((item) => item.status === "off");

  const notExitNumberList = onList.filter((item) => !item.number);
  const exitNumberList = onList
    .filter((item) => item.number)
    .sort((a, b) => Number(a.number) - Number(b.number));

  return [...exitNumberList.concat(notExitNumberList), ...offList];
}

//判断两个对象的value是否相同
export function towObjectEqual(obj1, obj2) {
  let boolean = false;
  for (let key in obj1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    } else {
      boolean = true;
    }
  }
  return boolean;
}

// 创建一个随机hash值
export function uuidToCreateHash() {
  const uuidString = uuid();
  return sha256(uuidString);
}

//返回文件类型
export function backFileType(file) {
  const splitArr = file.name.split(".");
  return splitArr[splitArr.length - 1];
}
