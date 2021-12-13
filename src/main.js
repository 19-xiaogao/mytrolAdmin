import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import mountComponent from "@/utils/mountCom";
import { joinPreviewUrl } from "./utils";
// import "@assets/js/iconfont.js";

import "ant-design-vue/dist/antd.css";

const app = createApp(App);
app.use(store);
app.use(router);
mountComponent(app);
app.config.globalProperties.joinPreviewUrl = joinPreviewUrl;

app.mount("#app");
