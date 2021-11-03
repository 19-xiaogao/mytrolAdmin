const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", resolve("./src"))
      .set("@assets", resolve("./src/assets"))
      .set("@api", resolve("./src/api/api.js"));
  },
  devServer: {
    proxy: {
      "/relay/dbchain/oracle/nft": {
        target: "http://192.168.0.19:3001",
        ws: true,
        changeOrigin: true,
      },
     
    },
  },
};
