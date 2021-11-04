import axios from "axios";

const server = axios.create({
  baseURL: "/relay/dbchain/oracle/nft",
  timeout: 3000,
});

server.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => Promise.reject(err)
);

server.interceptors.response.use(
  (config) => {
    return config.data;
  },
  (err) => Promise.reject(err)
);

export default server;
