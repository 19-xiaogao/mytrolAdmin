import axios from "axios";
import { Modal } from "ant-design-vue";
import { errorNotify } from "@/utils";
import router from "@/router";
import store from "@/store";
const baseUrl = process.env.VUE_APP_BASE_URL;
const server = axios.create({
  baseURL: baseUrl,
  timeout: 9000,
});

server.interceptors.request.use(
  (config) => {
    store.commit("setLoading", true);
    return config;
  },
  (err) => Promise.reject(err)
);
const handleError = (err) => {
  store.commit("setLoading", false);
  if (!err.code) {
    errorNotify("请求超时，请等待稍后重试...", "超时");
    return Promise.reject(err);
  }
  if (err.code === "ECONNABORTED" && err.message.includes("timeout")) {
    errorNotify("请求超时，请等待稍后重试...", "超时");
    return Promise.reject(err);
  }
  if (err.response) {
    const { data, status } = err.response;

    switch (status) {
      case 404:
        errorNotify("未找到资源", `${status}`);
        break;
      case 416:
        errorNotify("错误的请求参数 !", `${status}`);
        break;
      case 500:
        errorNotify("服务器错误", `${status}`);
        break;
      default:
        errorNotify(data.message, `${status}`);
        break;
    }
  }
  return Promise.reject(err);
};

server.interceptors.response.use((config) => {
  const responseData = config.data;
  store.commit("setLoading", false);
  if (responseData.err_code === "16" || responseData.err_code === "2") {
    localStorage.clear();
    Modal.warning({
      title: "提示",
      content: "登录已经过期,点击返回登陆页面重新登录!",
      maskClosable: false,
      okText: "退出登录",
      onOk() {
        router.push("/login");
      },
    });
    Modal.destroy();
  }
  if (responseData.err_code === "1") {
    errorNotify("密码错误");
  } else if (responseData.err_code === "3") {
    errorNotify("查询失败");
  } else if (responseData.err_code === "4") {
    errorNotify("服务错误");
  } else if (responseData.err_code === "5") {
    errorNotify("未定义命名错误");
  } else if (responseData.err_code === "7") {
    errorNotify("格式错误");
  } else if (responseData.err_code === "8") {
    errorNotify("参数错误");
  } else if (responseData.err_code === "9") {
    errorNotify("账号未注册");
  } else if (responseData.err_code === "13") {
    errorNotify("未经授权");
  } else if (responseData.err_code === "14") {
    errorNotify("身份验证失败");
  }

  return responseData;
}, handleError);

export default server;
