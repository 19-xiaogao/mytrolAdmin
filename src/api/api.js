import server from "./axios";

// login
export const loginApi = (data) => server.post("/backend_login", data);

// login out
export const logoutApi = () => server.post("/logout");

// add user
export const addUserApi = (data) => server.post("/backend/add_user", data);
