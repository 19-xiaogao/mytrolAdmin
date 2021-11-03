import axios from "axios";
import {setStorageToken} from '@/utils'
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
    if(config.config.url === '/backend_login' && config.data.err_code === '0'){
      setStorageToken(config.headers.go_session_id)
    }
    return config.data;
  },
  (err) => Promise.reject(err)
);

export default server;
