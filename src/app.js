require("dotenv").config();

const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const routes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/error");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "electrodead-api" });
});

app.use("/api", routes);

const frontendDist = path.join(__dirname, "..", "frontend", "dist");
const frontendIndex = path.join(frontendDist, "index.html");

if (fs.existsSync(frontendIndex)) {
  app.use(express.static(frontendDist));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    return res.sendFile(frontendIndex);
  });
} else {
  app.get("/", (_req, res) => {
    res.status(503).json({
      message: "Frontend ainda nao foi compilado. Rode: .\\bin\\npm.cmd run build:frontend"
    });
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
