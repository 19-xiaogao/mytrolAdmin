import axios from "axios";
import { Modal } from "ant-design-vue";
import router from "@/router";
const server = axios.create({
  baseURL: "/relay/dbchain/oracle/nft",
  timeout: 3000,
});

server.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => Promise.reject(err)
);

server.interceptors.response.use(
  (config) => {
    const responseData = config.data;
    if (responseData.err_code === "16" || responseData.err_code === "2") {
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
      return;
    }
    return responseData;
  },
  (err) => Promise.reject(err)
);

export default server;
