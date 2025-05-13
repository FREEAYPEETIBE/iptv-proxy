
const express = require('express');
const cors = require('cors');
const request = require('request');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/stream', (req, res) => {
  const streamUrl = req.query.url;
  if (!streamUrl) return res.status(400).send('Missing URL');

  const headers = {
    'User-Agent': 'Mozilla/5.0',
    'Referer': streamUrl
  };

  request({ url: streamUrl, headers }).on('error', () => {
    res.status(500).send('Error fetching stream');
  }).pipe(res);
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
