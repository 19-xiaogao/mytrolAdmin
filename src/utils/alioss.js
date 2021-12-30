import OSS from "ali-oss";
const client = new OSS({
  secure: true,
  region: "oss-cn-shenzhen",
  accessKeyId: "LTAI5tNN6DGAaRBMvQ453VA2",
  accessKeySecret: "vfomY0ur6nGOafIyTzCaEBZZIeVCQA",
  bucket: "mytrol-pub",
});
export default client;
