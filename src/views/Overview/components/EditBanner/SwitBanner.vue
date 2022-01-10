<template>
  <div class="box">
    <div class="left-box">
      <img v-show="currentParams.imgFile" :src="currentParams.imgFile" alt=""/>
      <div class="upload-btn">
        <span>上传图片</span>
        <input alt="" type="file" @change="handleUploadChange"/>
      </div>
    </div>
    <div class="right-box">
      <div class="select-box">
        <div class="select-branner">
          <span
              v-for="item in tableList"
              :key="item.key"
              :class="isSelectHoverClass(item.key)"
              @click="handleTabClick(item)"
          >Banner{{ item.key }}</span
          >
        </div>
        <icon-svg
            class="icon-add"
            icon="icon-bannerAdd"
            @click="addBannerClick"
        ></icon-svg>
      </div>
      <div v-if="showIpDom" class="small-program">
        <p>小程序跳转链接</p>
        <input type="text" value="http://longjiuwei999.com"/>
        <div class="save">保存</div>
      </div>

      <div v-else>
        <div class="input-box">
          <div class="input-title">
            <span class="title-one">标题</span>
            <span class="line"></span>
            <input
                v-model="currentParams.title"
                placeholder="请输入标题"
                type="text"
            />
          </div>
          <div class="input-title">
            <span class="title-one">描述</span>
            <span class="line"></span>
            <input
                v-model="currentParams.decs"
                placeholder="请输入描述"
                type="text"
            />
          </div>
        </div>
        <div class="input-url-save">
          <input
              v-model="currentParams.imgUrl"
              placeholder="请输入图片链接"
              type="text"
          />
          <div class="save" @click="saveBannerClick">保存</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, onMounted, ref, toRaw} from "vue";
import {getBannerApi, updateBannerApi, uploadAliOssApi} from "@api";
import {successNotify, warningNotify} from "@/utils";

const defaultTabList = [
  {
    name: "Banner1",
    key: 1,
    imgFile: "",
    title: "",
    decs: "",
    imgUrl: "",
  },
];

export default {
  props: {
    smallProgram: {
      type: Boolean,
    },
    menus: {
      type: Array,
    },
  },
  setup(props) {
    const currentParams = ref(defaultTabList[0]);
    const tableList = ref(defaultTabList);
    const tx_hash = ref("");
    const isSelectHoverClass = computed(
        () => (index) => index === currentParams.value.key ? "select-hover" : ""
    );
    const handleTabClick = (item) => {
      currentParams.value = item;
    };
    const showIpDom = computed(() => props.smallProgram);
    const handleUploadChange = async (e) => {
      const files = e.target.files[0];
      const formData = new FormData();
      formData.append("file", files);

      const splitArr = files.name.split(".");
      const imgType = splitArr[splitArr.length - 1];
      const fileName = `banner${currentParams.value.key}.${imgType}`;

      const result = await uploadAliOssApi(fileName, formData.get("file"));
      if (result.res.status === 200) {
        currentParams.value.imgFile = result.url;
      }
      e.target.value = "";
    };
    const addBannerClick = async () => {
      if (tableList.value.length >= 5) return warningNotify("最多添加5个");
      tableList.value = [
        ...toRaw(tableList.value),
        {
          ...defaultTabList,
          key: tableList.value.length + 1,
        },
      ];
      currentParams.value = tableList.value[tableList.value.length - 1];
    };
    const assignment = (result) => {
      tx_hash.value = result.tx_hash;
      let list = JSON.parse(result.banner_info);
      if (!list) return;

      tableList.value = list;
    };
    const saveBannerClick = async () => {
      let uploadData = [];
      if (tableList.value.length === 1) {
        uploadData.push(toRaw(currentParams.value));
      } else {
        tableList.value.forEach((item) => {
          if (item.key === currentParams.value.key) {
            delete item[0];
            item.key = currentParams.value.key;
            item.name = currentParams.value.name;
            item.imgFile = currentParams.value.imgFile;
            item.title = currentParams.value.title;
            item.decs = currentParams.value.decs;
            item.imgUrl = currentParams.value.imgUrl;
          }
        });
        uploadData = tableList.value;
      }
      await updateBannerApi(JSON.stringify(uploadData));
      setTimeout(() => {
        getBanner();
        successNotify("更新成功");
      }, 1000);
    };
    const getBanner = async () => {
      const {err_code, result} = await getBannerApi();
      if (err_code === "0") {
        assignment(result);
        handleTabClick(tableList.value[0]);
      }
    };

    onMounted(() => {
      getBanner();
    });

    return {
      showIpDom,
      currentParams,
      isSelectHoverClass,
      handleTabClick,
      tableList,
      handleUploadChange,
      addBannerClick,
      saveBannerClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  margin-top: 10px;
  overflow: hidden;
  animation: slidingTBanner 0.4s linear 0s;

  .left-box {
    width: 287px;
    height: 215px;
    overflow: hidden;

    border-radius: 5px;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 50%;
    }

    .upload-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80px;
      text-align: center;
      height: 34px;
      line-height: 34px;
      background: linear-gradient(270deg, #ff451d 0%, #ffca2a 100%);
      border-radius: 6px;
      color: #ffffff;

      input {
        cursor: pointer;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        display: block;
        opacity: 0;
        z-index: 1;
      }
    }
  }

  .right-box {
    flex: 1;
    margin-left: 20px;

    .select-box {
      display: flex;
      justify-content: space-between;

      .select-branner {
        span {
          margin-right: 18px;
          font-size: 14px;
          font-weight: 400;
          color: #979797;
          cursor: pointer;
        }

        .select-hover {
          font-size: 16px;
          font-weight: 500;
          color: #0d0048;
          position: relative;

          &::after {
            position: absolute;
            display: inline-block;
            bottom: -4px;
            left: 50%;
            transform: translateX(-50%);
            content: "";
            width: 18px;
            height: 4px;
            background: linear-gradient(270deg, #ff451d 0%, #ffca2a 100%);
            border-radius: 2px;
          }
        }
      }

      .icon-add {
        cursor: pointer;
        font-size: 1.4rem;
      }
    }

    .input-box {
      margin-top: 24px;

      .input-title {
        width: 100%;
        box-sizing: border-box;
        background: #f1f1f1;
        border-radius: 6px;
        display: flex;
        align-items: center;
        height: 40px;
        padding: 12px;

        .title-one {
          color: #1c1c1c;
          font-size: 16px;
        }

        .line {
          display: inline-block;
          width: 1px;
          height: 18px;
          background: #444444;
          border-radius: 1px;
          margin: 0 14px;
        }

        input {
          flex: 1;
          color: #1c1c1c;
          font-size: 14px;
          font-weight: 400;
        }
      }

      & .input-title:nth-child(2) {
        margin-top: 14px;
      }
    }

    .input-url-save {
      display: flex;
      margin-top: 30px;
      justify-content: space-between;

      input {
        background: #f7f7f7;
        border-radius: 6px;
        flex: 1;
        padding-left: 10px;
        margin-right: 10px;
      }
    }

    .small-program {
      margin-top: 28px;

      p {
        font-size: 14px;
        color: #434343;
        text-align: left;
      }

      input {
        width: 100%;
        height: 62px;
        background: #f7f7f7;
        border-radius: 6px;
        color: #434343;
        font-size: 14px;
        padding: 24px 77px 24px 64px;
      }

      div {
        margin-top: 14px;
        float: right;
      }
    }
  }
}

.save {
  width: 80px;
  height: 34px;
  text-align: center;
  line-height: 34px;
  color: #fff;
  background: linear-gradient(270deg, #ff451d 0%, #ffca2a 100%);
  border-radius: 6px;
}
</style>
