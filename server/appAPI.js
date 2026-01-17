const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const env = process.env.NODE_ENV || "development";

const app = express();
app.disable("x-powered-by");

app.use(compression({ level: 9, memLevel: 9 }));

app.use(bodyParser.json({ limit: "10mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "10mb",
    extended: true,
    parameterLimit: 100000,
  })
);

app.use(cookieParser());

// const userRoutes  = require('./routes/user');
// const productRoutes = require('./routes/product');

app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Accept, Origin, Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.get("/health", (req, res) => {
  return res.json({ status: "ok ✅", env });
});
// app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes);

app.use((req, res) => {
  return res.status(404).json({
    message: "API  Not Found",
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = env === "development" ? err.message : "Internal Server Error";
  return res.status(statusCode).json({
    message,
    error: env === "development" ? err : undefined,
  });
});

module.exports = app;