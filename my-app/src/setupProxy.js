// src/setupProxy.js

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://localhost:44333", // Update with your backend URL
      changeOrigin: true,
      secure: false,
    })
  );
};
