const path = require("path");

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {

    configureWebpack: (config) => {
        config.module.noParse =
            /^(vu|vue-router|vuex|vuex-router-sync|lodash|echarts|axios|antd-design-vue)$/;
    },
    chainWebpack: (config) => {
        config.resolve.alias
            .set("@", resolve("./src"))
            .set("@assets", resolve("./src/assets"))
            .set("@api", resolve("./src/api/api.js"));

        // 压缩img
        config.module
            .rule("images")
            .test(/\.(png|jpe?g|gif)(\?.*)?$/)
            .use("image-webpack-loader")
            .loader("image-webpack-loader")
            .options({ bypassOnDebug: true })
            .end();
    },
    devServer: {
        port: 3001,
        proxy: {
            // 本地开发环境地址....
            "/relay/dbchain/oracle/nft": {
                target: "http://192.168.0.19:3001",
                ws: true,
                changeOrigin: true,
            },
            //沙盒环境地址
            "/dev_relay/dbchain/oracle/nft": {
                target: "https://controlpanel.dbchain.cloud/nft_relay",
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/dev_relay': ''
                }
            },
            // 线上环境地址
            "/pro_relay/dbchain/oracle/nft": {
                target: "https://mytroladmin.dbchain.cloud/nft_relay",
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/pro_relay': ''
                }
            },
        },
    },
};
