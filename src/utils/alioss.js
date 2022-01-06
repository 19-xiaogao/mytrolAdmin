import OSS from "ali-oss";

const client = new OSS({
  secure: true,
  // 线上环境
  // region: "oss-cn-shenzhen",
  // accessKeyId: "LTAI5tNN6DGAaRBMvQ453VA2",
  // accessKeySecret: "vfomY0ur6nGOafIyTzCaEBZZIeVCQA",
  // bucket: "mytrol-pub",
  // 测试环境
  region: "oss-cn-shenzhen",
  accessKeyId: "LTAI5tJJw9WL4LRVP4WbybU3",
  accessKeySecret: "ifycUIZnfXPwrVnKLJ8a3lcIrkZim3",
  bucket: "apply-sign",

});

export default client;
