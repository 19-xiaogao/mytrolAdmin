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
          <!-- <img src="../assets/images/avatar.png" alt="author" /> -->
        </span>
        <h1 class="island">Mytrol</h1>
      </div>
      <div class="form-item">
        <label class="ipt-item">
          <input type="text" required autocomplete="off" />
          <span class="tip-label">Username</span>
          <span class="border-line" />
        </label>
      </div>
      <div class="form-item">
        <label class="ipt-item">
          <input type="password" autocomplete="off" required />
          <span class="tip-label">Password</span>
          <span class="border-line" />
        </label>
      </div>
      <div class="form-item">
        <button class="btn btn-primary btn-login" type="button">GO</button>
      </div>
    </div>
    <div class="hint">
      Hope that all the good things will come on schedule...
    </div>
  </section>
</template>

<style lang="scss">
@import "../assets/css/login.scss";
</style>
