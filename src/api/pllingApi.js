import { pollingServer } from "./axios";
import store from "@/store";

const ASeconds = 1000;

// 轮询审核列表数据
export const pollingQueryPublishingApi = async (params, id, fc) => {
  store.commit("setLoading", true);
  const { result } = await pollingServer.get(
    "/publishing/" + params.current + "/" + params.numbers
  );
  if (Array.isArray(result) && result.length === 0) {
    store.commit("setLoading", false);
    return fc && fc(result);
  }
  const isFindId = result.list.find((item) => item.id === id);
  if (!isFindId) {
    store.commit("setLoading", false);
    return fc && fc(result);
  }
  setTimeout(() => pollingQueryPublishingApi(params, id, fc), ASeconds);
};

// 轮询运营列表
export const pollingGetSerisesIpApi = async (length, fc) => {
  store.commit("setLoading", true);
  const { result } = await pollingServer.get("/backend/get_serises_ip");
  if (result.length !== length) {
    store.commit("setLoading", false);
    return fc && fc(result);
  }
  setTimeout(() => pollingGetSerisesIpApi(length, fc), ASeconds);
};
// 查询name
export const pollingAddUpdateIpApi = async (diffParams, fc) => {
  store.commit("setLoading", true);
  const { result } = await pollingServer.get("/backend/get_serises_ip");
  const targetFind = result.find((item) => item.name === diffParams.name);
  if (targetFind.status !== diffParams.status) {
    store.commit("setLoading", false);
    return fc && fc(result);
  }
  setTimeout(() => pollingAddUpdateIpApi(diffParams, fc), ASeconds);
};
// 查询status
export const pollingUpdateNumberApi = async (diffParams, fc) => {
  store.commit("setLoading", true);
  const { result } = await pollingServer.get("/backend/get_serises_ip");
  const targetFind = result.find((item) => item.name === diffParams.name);
  if (Number(targetFind.number) === diffParams.number) {
    store.commit("setLoading", false);
    return fc && fc(result);
  }
  setTimeout(() => pollingUpdateNumberApi(diffParams, fc), ASeconds);
};

// 查询作品
export const pollingItemsPublishApi = async (diffParams, fc) => {
  store.commit("setLoading", true);
  const { result } = await pollingServer.get(
    "/nfts_of_user_make/all/" + diffParams.userId
  );
  const targetFind = result.find((item) => item.id === diffParams.itemId);
  if (targetFind.publish !== diffParams.publish) {
    store.commit("setLoading", false);
    return fc && fc(result);
  }
  setTimeout(() => pollingItemsPublishApi(diffParams, fc), ASeconds);
};

// 查询天数
export const pollingGivingDaysApi = async (days, fc) => {
  store.commit("setLoading", true);

  const { result } = await pollingServer.get("/backend/get_give_time");

  if (days !== result.days) {
    store.commit("setLoading", false);
    return fc && fc(result);
  }

  setTimeout(() => pollingGivingDaysApi(days, fc), ASeconds);
};

// 查询轮播图数量
export const pollingBannerApi = async (tx_hash, fc) => {
  store.commit("setLoading", true);

  const { result } = await pollingServer.get("/get_banner");

  if (tx_hash !== result.tx_hash) {
    store.commit("setLoading", false);
    return fc && fc(result);
  }

  setTimeout(() => pollingBannerApi(tx_hash, fc), ASeconds);
};
