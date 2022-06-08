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
export const uploadNftApi = (data) =>
    server.post("/nft_make_without_money", data, {
        headers: {
            "content-type": "application/x-www-form-urlencoded",
        },
    });

// 获取运营IP
export const getSerisesIpApi = () => server.get("/backend/get_serises_ip");

// 审核列表
export const getPublishingApi = (params) =>
    server.get("/publishing/" + params.current + "/" + params.numbers);

// 通过审核
export const auditPassedApi = (data) => server.post("/review", data);

// 用户信息编辑
export const editPersonApi = (data) =>
    server.post("/nft_edit_personnal_information", data, {
        headers: {
            "content-type": "application/x-www-form-urlencoded",
        },
    });

// 查询用户信息
export const getUserInfoApi = () => server.get("/user_info");

// 增加或者修改ip
export const addUpdateIpApi = (data) =>
    server.post("/backend/add_update_ip", data, {
        headers: {
            "content-type": "application/x-www-form-urlencoded",
        },
    });

//获取IP
export const getSeriesApi = () => server.get("/backend/get_serises_ip");

// 查看自己的作品
export const getWorksApi = (id) => server.get("/nfts_of_user_make/all/" + id);

//获取交易量
export const getTradeDataCountApi = () => server.get("/get_trade_data");

//查看IP系列
export const getLatestNftApi = (ip, page, numbers) =>
    server.get("/lastest_nft/" + ip + "/" + page + "/" + numbers);

// 下架作品
export const shelvesNftApi = (id) =>
    server.post("/nft_withdraw", {
        denom_id: String(id),
    });

// 查看兑换码
export const redeemCodeApi = (id) => server.get("/redeem_code/" + id);

// 上架
export const onShelvesNftApi = (data) => server.post("/nft_public", data);

// 查询转赠天数
export const queryGivingDayApi = () => server.get("/backend/get_give_time");

// 设置转赠天数
export const setGivingDayApi = (days) =>
    server.post("/backend/set_give_time", {
        days,
    });

// 更新banner
export const updateBannerApi = (bannerInfo) => {
    server.post("/update_banner", {
        banner_info: bannerInfo,
    });
};

//获取banner
export const getBannerApi = () => server.get("/get_banner");

// 上传图片
export const uploadFIleApi = (data) => server.post("/uploadFile", data);

//订单
export const getAllOrderApi = (params) =>
    server.get("/all_success_order/" + params.current + "/" + params.numbers);

// 查询分类
export const getClassificationApi = () => server.get("/backend/get_classification");

// 添加分类
export const addClassificationApi = (name) =>
    server.post("/backend/add_classification", {
        name,
    });

// 获取作品的所有订单
export const getSuccessOrderApi = (id) => server.get("/denom_success_order/" + id);

// 获取所有兑换码
export const getAllPrivate = (id) => server.get("/nft_private_redeem_code/" + id);

// 管理员获取所有作品数据
export const GetAdminAllNftApi = (page, size) => server.get("/admin_get_all_nft/" + page + "/" + size);

// 发送积分
export const postSendTokenApi = (data) => server.post('/backend/send_token', data)


// 获取分享链接
export const getShareAccessToken = (expirationTime, id) =>
    server.get("/get_share_accesstoken/" + expirationTime + "/" + id);

//通过地址查询用户信息
export const getAddressUserInfoApi = (address) => server.get('/backend/get_user_all_info/' + address)

// 添加或删除白名单用户
export const actionWhiteListApi = (data) => server.post('/whitelist_modify', data);

// 1. address
// 2. all
// 3. whitelist_id
// 查询白名单
export const queryWhiteListApi = (address) => server.get('/whitelist/' + address);

// 更改nft购买白名单许可
export const setPermissionApi = (params) => server.post('/set_donom_sell_status', params)

// 设置nft 转增状态
export const setNftTransferStatusApi = (params) => server.post('/backend/set_demon_transfer_status', params)

//新增一个白名单
export const addNewWhiteListApi = (params) => server.post('/backend/add_new_whitelist', params)

//查询所有白名单
export const queryAllWhiteListApi = () => server.get('/backend/get_all_whitelist');

// "action"  : "", //"add" or "remove"
//将用户加到一个白名单
export const addUserToWhiteListApi = (params) => server.post('/backend/add_user_to_new_whitelist', params)

// 藏品 绑定 白名单
export const denomBindWhitelistApi = (params) => server.post('/backend/denom_bind_whitelist', params)

// 查询用户冻结状态
export const queryUserFreezeStatusApi = (address) => server.get('/backend/get_user_freeze_status/' + address)

//冻结用户
export const setUserFreezeStatusApi = (params) => server.post('/backend/set_user_freeze_status', params)


// 获取nft拥有者
export const queryNftHoldersApi = (denom_id) => server.get('/backend/get_nft_holders/' + denom_id)

// 查询作品绑定的白名单
export const queryDenomBindWhiteListApi = (denom_id) => server.get('/backend/show_denom_bind_whitelist/' + denom_id)

// 删除ip
export const remoteIpApi = (params) => server.post('/backend/drop_ip', params)

//查询nft数据
export const queryNftApi = (params) => server.get(`/admin_seach_all_nft/${params.field}/${params.value}`)

// 解除绑定
export const unBindDenomWhiteListApi = (params) => server.post('/backend/denom_unbind_whitelist', params)

//查询退款列表
export const queryRefundOrdersApi = (denomId) => server.get('/unionpay/get_orderids_to_refund/' + denomId);

// 退款
export const refundsOrderApi = (orderId) => server.post('/unionh5_pay_refunds/' + orderId)


//设置项目的开启和维护
export const setSystemStatusApi = (params) => server.post('/set_system_status/' + params.status)

//查询项目的系统状态
export const querySystemStatusApi = () => server.get('/get_system_status')