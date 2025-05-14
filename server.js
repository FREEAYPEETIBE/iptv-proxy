const express = require("express");
const proxy = require("express-http-proxy");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 8080;

// Load header rules
let headerRules = [];
try {
  headerRules = JSON.parse(fs.readFileSync("proxy_headers.json", "utf-8"));
} catch (e) {
  console.error("Error loading proxy_headers.json", e);
}

function matchHeaders(url) {
  const matched = headerRules.find(rule => url.includes(rule.match));
  return matched ? matched.headers : {};
}

app.get("/proxy", (req, res, next) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("Missing 'url' query");

  const { origin, pathname } = new URL(targetUrl);
  const headers = matchHeaders(targetUrl);

  proxy(origin, {
    proxyReqPathResolver: () => pathname + (targetUrl.includes("?") ? "?" + targetUrl.split("?")[1] : ""),
    proxyReqOptDecorator: (proxyReqOpts) => {
      proxyReqOpts.headers = {
        ...proxyReqOpts.headers,
        ...headers
      };
      return proxyReqOpts;
    }
  })(req, res, next);
});

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));