const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const TARGET = process.env.TARGET_SERVER || 'http://182.44.1.58:8000';
const PORT = process.env.PORT || 3000;

app.use('/', createProxyMiddleware({
  target: TARGET,
  secure: false,
  changeOrigin: true,
  ws: true,
  logLevel: 'debug',
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).send('Proxy Error');
  }
}));

app.use((err, req, res, next) => {
  console.error('Application Error:', err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server is running on port ${PORT}`);
  console.log(`Proxying to ${TARGET}`);
});

// 未捕获的异常处理
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
