<template>
  <div class="make-query">
    <p class="message">信息</p>
    <div class="pass-item">
      <div class="item" v-for="item in worksList" :key="item.id">
        <div class="item-delta">
          <span>作品</span>
          <span>「{{ item.name }}」</span>
          <span>上架</span>
          <span class="pass-color">审核通过</span>
        </div>
        <div class="time">
          {{ dayjs(item.opening_time * 1000).format("YYYY-MM-DD HH:mm") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { getWorksApi } from "@api";
import { useStore } from "vuex";
import dayjs from "dayjs";
export default {
  setup() {
    const store = useStore();
    const worksList = ref([]);
    const user = computed(() => store.getters.getUser);
    const getWorksList = async () => {
      const { err_code, result } = await getWorksApi(user.value.user_id);
      if (err_code === "0") {
        if (!Array.isArray(result)) return;
        worksList.value = result
          .filter((item) => item.publish === "2")
          .sort((a, b) => Number(b.opening_time) - Number(a.opening_time));
      }
    };
    onMounted(() => {
      getWorksList();
    });
    return {
      dayjs,
      worksList,
    };
  },
};
</script>

<style scoped lang="scss">
.make-query {
  width: 58%;
  height: 298px;
  background: #ffffff;
  box-shadow: 0px 4px 12px 0px rgba(182, 182, 182, 0.13);
  border-radius: 8px;
  border: 0px solid rgba(213, 213, 213, 0.58);
  box-sizing: border-box;
  padding: 21px 30px;
  .message {
    font-size: 20px;
    font-weight: 500;
    color: #0d0048;
    text-align: left;
  }
  .pass-item {
    height: 80%;
    overflow-y: auto;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 30px;
      .item-delta {
        span {
          font-size: 16px;
          font-weight: 400;
          color: #434343;
        }
        .pass-color {
          color: #6047a3;
        }
      }
      .time {
        font-size: 16px;
        font-weight: 400;
        color: #6a6a6a;
      }
    }
  }
}
</style>
