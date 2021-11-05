import server from "./axios";

// 登陆
export const loginApi = (data) => server.post("/backend_login", data);

// 退出登陆
export const logoutApi = () => server.post("/logout");

// 添加用户
export const addUserApi = (data) => server.post("/backend/add_user", data);

// 上传作品
export const uploadNftApi = (data) =>
  server.post("/nft_make_without_money", data, {
    headers: { "content-type": "application/x-www-form-urlencoded" },
  });

// 获取运营IP
export const getSerisesIpApi = () => server.get("/backend/get_serises_ip");

//
export const getOrderNumberApi = () => server.get("/user_nft_order_number");

// 审核列表
export const getPublishingApi = (params) =>
  server.get("/publishing/" + params.page + "/" + params.numbers);

// 通过审核
export const auditPassedApi = (data) => server.post("/review", data);

// 用户信息编辑
export const editPersonApi = (data) =>
  server.post("/nft_edit_personnal_information", data, {
    headers: { "content-type": "application/x-www-form-urlencoded" },
  });

// 查询用户信息
export const getUserInfoApi = () => server.get("/user_info");

// 增加或者修改ip
export const addUpdateIpApi = (data) =>
  server.post("/backend/add_update_ip", data, {
    headers: { "content-type": "application/x-www-form-urlencoded" },
  });

//获取IP
export const getSeriessApi = () => server.get("/backend/get_serises_ip");

// 查看自己的作品
export const getWorksApi = (id) => server.get("/nfts_of_user_make/all/", id);
