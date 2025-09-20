const path = require("path");
const { override, addWebpackAlias } = require("customize-cra");

module.exports = override(
  addWebpackAlias({
    "@api": path.resolve(__dirname, "src/api"),
    "@components": path.resolve(__dirname, "src/components"),
    "@constants": path.resolve(__dirname, "src/constants"),
    "@helpers": path.resolve(__dirname, "src/helpers"),
    "@pages": path.resolve(__dirname, "src/pages"),
    "@routes": path.resolve(__dirname, "src/routes"),
    "@store": path.resolve(__dirname, "src/store"),
    "@styles": path.resolve(__dirname, "src/styles"),
    "@utils": path.resolve(__dirname, "src/utils"),
  })
);
