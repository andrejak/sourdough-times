import { createProxyMiddleware } from "http-proxy-middleware";
import Bundler from "parcel-bundler";
import Express from "express";

const bundler = new Bundler("src/index.html", {
  cache: false,
});

const app = Express();
const PORT = process.env.PORT || 1234;

app.use(
  "/.netlify/functions/",
  createProxyMiddleware({
    target: "http://localhost:9000",
    pathRewrite: {
      "/.netlify/functions/": "",
    },
  })
);

app.use(bundler.middleware());
app.listen(PORT);
