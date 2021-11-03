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
          <!-- <img src="@assets/images/avatar.png" alt="author" /> -->
        </span>
        <h1 class="island">Mytrol</h1>
      </div>
      <div class="form-item">
        <label class="ipt-item">
          <input type="text" required autocomplete="off" v-model="username" />
          <span class="tip-label">Username</span>
          <span class="border-line" />
        </label>
      </div>
      <div class="form-item">
        <label class="ipt-item">
          <input
            type="password"
            autocomplete="off"
            required
            v-model="password"
          />
          <span class="tip-label">Password</span>
          <span class="border-line" />
        </label>
      </div>
      <div class="form-item">
        <button
          class="btn btn-primary btn-login"
          type="button"
          @click="handleLoginBtn"
        >
          GO
        </button>
      </div>
    </div>
    <div class="hint">
      Hope that all the good things will come on schedule...
    </div>
  </section>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { loginApi } from "@api";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const router = useRouter();
    const store = useStore();
    const loginParms = reactive({ username: "", password: "" });

    const handleLoginBtn = async () => {
      const response = await loginApi(loginParms);
      if (response.err_code === "0") {
        window.$message.success({
          message: "提示",
          description: "欢迎回来!",
        });
        store.commit("setRole", response.result.role);
        router.push("/");
      } else {
        window.$message.error({
          message: "提示",
          description: "账号或者密码错误!",
        });
      }
    };
    return {
      handleLoginBtn,
      ...toRefs(loginParms),
    };
  },
});
</script>
<style lang="scss">
@import "../assets/css/login.scss";
</style>
