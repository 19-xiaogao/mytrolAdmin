<template>
    <section class="login-container">
        <div class="login-container-bg" />
        <div class="login-container-bg" />
        <div class="login-container-bg" />
        <div class="login-form flex-col fixed-center">
            <span class="circle" />
            <span class="circle" />
            <span class="circle" />
            <span class="circle" />
            <span class="circle" />
            <div class="form-item login-header d-flex">
                <span class="avatar flex-center">
                    <img alt="author" src="@assets/images/mytrolLogo.png" />
                </span>
            </div>
            <div class="form-item">
                <label class="ipt-item">
                    <input v-model.trim="username" autocomplete="off" required type="text" />
                    <span class="tip-label">Username</span>
                    <span class="border-line" />
                </label>
            </div>
            <div class="form-item">
                <label class="ipt-item">
                    <input
                        v-model.trim="password"
                        autocomplete="off"
                        required
                        type="password"
                        @keydown.enter="handleLoginBtn"
                    />
                    <span class="tip-label">Password</span>
                    <span class="border-line" />
                </label>
            </div>
            <div class="form-item">
                <button class="btn btn-primary btn-login" type="button" @click="handleLoginBtn">GO</button>
            </div>
        </div>
        <div class="hint">Hope that all the good things will come on schedule...</div>
    </section>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { getUserInfoApi, loginApi } from "@api";
import { useStore } from "vuex";
import { notify, setStorageRole } from "@/utils";

export default defineComponent({
    setup() {
        const router = useRouter();
        const store = useStore();
        const { proxy } = getCurrentInstance();
        const loginParams = reactive({ username: "", password: "" });

        const handleLoginBtn = async () => {
            if (loginParams.username.trim() === "") {
                return notify("提示", "请输入用户名", "warning");
            }
            if (loginParams.password.trim() === "") {
                return notify("提示", "请输入密码", "warning");
            }

            const response = await loginApi(loginParams);

            if (response.err_code === "0") {
                notify("提示", "欢迎回来", "success");

                getUserInfoApi().then(({ err_code, result }) => {
                    if (err_code === "0") {
                        // 本地存一份，vuex 存一份
                        const setPersonMessage = {
                            ...result,
                            avatar: proxy.joinPreviewUrl(result.avatar),
                        };

                        setStorageRole(JSON.stringify(response.result));
                        store.commit("setUser", response.result);
                        store.commit("setPersonMessage", setPersonMessage);
                        localStorage.setItem("personMessage", JSON.stringify(setPersonMessage));
                        router.push("/");
                    }
                });
            }
        };
        return {
            handleLoginBtn,
            ...toRefs(loginParams),
        };
    },
});
</script>
<style lang="scss">
@import "../assets/css/login.scss";
</style>
