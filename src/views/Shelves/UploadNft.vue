<template>
  <div class="upload-nft">
    <img src="@assets/images/mytrolLogo.png" class="logo" alt="" />
    <div class="add-logo">
      <img src="@assets/images/sheleves-add.png" alt="" />
      <p>上传创作数字藏品</p>
    </div>
    <input type="file" class="input-file"  />
  </div>
</template>

<script>
// 这里实现上传的逻辑
export default {};
</script>

<style scoped lang="scss">
.upload-nft {
  width: 358px;
  height: 470px;
  background: #f7f7f7;
  border-radius: 8px;
  position: relative;
  .logo {
    position: absolute;
    top: 26px;
    left: 26px;
  }
  .add-logo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    p {
      margin-top: 20px;
      font-size: 20px;
      color: #7d7d7d;
    }
  }
  .input-file {
    width: 100%;
    margin-top: 26px;
    height: calc(100% - 26px);
    opacity: 0;
    cursor: pointer;
  }
}
</style>
