const https = require('https');
const http = require('http');

const TARGET = 'wlchat.xyz';

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const options = {
    hostname: TARGET,
    port: 443,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: TARGET,
    },
    rejectUnauthorized: false,
  };

  const proxy = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxy.on('error', (err) => {
    res.status(502).json({ error: 'Proxy error', details: err.message });
  });

  req.pipe(proxy, { end: true });
};
