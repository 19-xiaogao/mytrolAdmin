import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Antd, { notification } from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import IconSvg from "./components/IconSvg";
const app = createApp(App);
app.use(store);
app.use(router);
app.use(Antd);
app.component("icon-svg", IconSvg);

app.config.globalProperties.$message = notification;
window.$message = notification;

app.mount("#app");
