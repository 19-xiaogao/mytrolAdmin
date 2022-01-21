import { pollingServer } from "./axios";
import store from "@/store";

const ASeconds = 1.5 * 1000;

// 轮询审核列表数据
export const pollingQueryPublishingApi = async (params, id, fc) => {
    store.commit("setLoading", true);
    const { result } = await pollingServer.get("/publishing/" + params.current + "/" + params.numbers);
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


