const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const env = process.env.NODE_ENV || "development";

const app = express();
app.disable("x-powered-by");

app.use(compression());

app.use(
  cors({
    origin: ["https://frontend-service-121438965080.asia-south1.run.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  bodyParser.json({
    limit: "10mb",
  }),
);

app.use(
  bodyParser.urlencoded({
    limit: "10mb",
    extended: true,
    parameterLimit: 100000,
  }),
);

app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://frontend-service-121438965080.asia-south1.run.app",
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

const userRoutes = require("./routes/api/user");

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Backend Running Successfully",
  });
});

app.use((req, res) => {
  return res.status(404).json({
    message: "API Not Found",
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    message: env === "development" ? err.message : "Internal Server Error",
  });
});

module.exports = app;