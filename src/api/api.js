import server from "./axios";

// 登陆
export const loginApi = (data) => server.post("/backend_login", data);

// 退出登陆
export const logoutApi = () => server.post("/logout");

// 添加用户
export const addUserApi = (data,config) => server.post("/backend/add_user", data,config);

// 上传作品
export const uploadNftApi = (data) => server.post('/nft_make_without_money',data)

// 获取运营IP
export const getSerisesIpApi = () => server.get('/backend/get_serises_ip')

//
export const getOrderNumberApi = () => server.get('/user_nft_order_number')

// 审核列表
export const getPublishingApi = (params) => server.get('/publishing/'+params.page + "/" +params.numbers)