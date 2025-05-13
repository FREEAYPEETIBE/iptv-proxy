
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/proxy', createProxyMiddleware({
  target: 'https://cdn.ganbaruby23.xyz',
  changeOrigin: true,
  pathRewrite: {
    '^/proxy': '',
  },
  selfHandleResponse: false,
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('Referer', 'https://filitv.live');
    proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_7 like Mac OS X)');
    proxyReq.setHeader('Origin', 'https://filitv.live');
    proxyReq.setHeader('Accept', '*/*');
    proxyReq.setHeader('Connection', 'keep-alive');
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Improved proxy server running at http://localhost:${PORT}`);
});
