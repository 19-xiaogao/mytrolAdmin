import OSS from "ali-oss";
const client = new OSS({
  secure: true,
  region: "oss-cn-shenzhen",
  accessKeyId: "LTAI5tJJw9WL4LRVP4WbybU3",
  accessKeySecret: "ifycUIZnfXPwrVnKLJ8a3lcIrkZim3",
  bucket: "apply-sign",
});
export default client;
