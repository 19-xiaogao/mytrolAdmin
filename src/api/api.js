import server from "./axios";
import aliClientOss from "@/utils/alioss";

// alioss 上传文件
export const uploadAliOssApi = async (name, file) => {
    return aliClientOss.put(`mytrol/${name}`, file);
};

// 登录
export const loginApi = (data) => server.post("/backend_login", data);

// 退出登陆
export const logoutApi = () => server.post("/logout");

// 添加用户
export const addUserApi = (data) => server.post("/backend/add_user", data);

// 上传作品
export const uploadNftApi = (data) => server.post("/nft_make_without_money", data, {
    headers: {"content-type": "application/x-www-form-urlencoded"},
});

// 获取运营IP
export const getSerisesIpApi = () => server.get("/backend/get_serises_ip");

// 审核列表
export const getPublishingApi = (params) => server.get("/publishing/" + params.current + "/" + params.numbers);

// 通过审核
export const auditPassedApi = (data) => server.post("/review", data);

// 用户信息编辑
export const editPersonApi = (data) => server.post("/nft_edit_personnal_information", data, {
    headers: {"content-type": "application/x-www-form-urlencoded"},
});

// 查询用户信息
export const getUserInfoApi = () => server.get("/user_info");

// 增加或者修改ip
export const addUpdateIpApi = (data) => server.post("/backend/add_update_ip", data, {
    headers: {"content-type": "application/x-www-form-urlencoded"},
});

//获取IP
export const getSeriesApi = () => server.get("/backend/get_serises_ip");

// 查看自己的作品
export const getWorksApi = (id) => server.get("/nfts_of_user_make/all/" + id);

//获取交易量
export const getTradeDataCountApi = () => server.get("/get_trade_data");

//查看IP系列
export const getLatestNftApi = (ip, page, numbers) => server.get("/lastest_nft/" + ip + "/" + page + "/" + numbers);

// 下架作品
export const shelvesNftApi = (id) => server.post("/nft_withdraw", {denom_id: String(id)});

// 查看兑换码
export const redeemCodeApi = (id) => server.get("/redeem_code/" + id);

// 上架
export const onShelvesNftApi = (data) => server.post("/nft_public", data);

// 查询转赠天数
export const queryGivingDayApi = () => server.get("/backend/get_give_time");

// 设置转赠天数
export const setGivingDayApi = (days) => server.post("/backend/set_give_time", {days});

// 更新banner
export const updateBannerApi = (bannerInfo) => {
    server.post("/update_banner", {banner_info: bannerInfo});
};

//获取banner
export const getBannerApi = () => server.get("/get_banner");

// 上传图片
export const uploadFIleApi = (data) => server.post("/uploadFile", data);

//订单
export const getAllOrderApi = (params) => server.get("/all_success_order/" + params.current + "/" + params.numbers);

// 查询分类
export const getClassificationApi = () => server.get("/backend/get_classification");

// 添加分类
export const addClassificationApi = (name) => server.post("/backend/add_classification", {name});

// 获取作品的所有订单
export const getSuccessOrderApi = (id) => server.get('/denom_success_order/' + id);

// 获取所有兑换码
export const getAllPrivate = (id) => server.get('/nft_private_redeem_code/' + id);
