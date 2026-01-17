#!/usr/bin/env node
const appAPI = require("../appAPI.js");
const models = require("../models");
const env = process.env.NODE_ENV || "development";
const config = require("../config/db.json")[env];

appAPI.set("port", config.apiPort || 8000);

const server = appAPI.listen(appAPI.get("port"), async () => {
  console.log(`[API] Listening on port ${appAPI.get("port")}`);
  try {
    await models.sequelize.authenticate();
    console.log("Database Connected");
    await models.sequelize.sync();
  } catch (err) {
    console.error("Database Connection Failed ", err);
    process.exit(1);
  }
});

server.setTimeout(1000 * 60 * 2);

const sockets = new Set();
server.on("connection", (socket) => {
  sockets.add(socket);
  socket.on("close", () => sockets.delete(socket));
});

let shuttingDown = false;
const gracefulShutdown = async () => {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log("[Server] Shutting down...");
  const forceTimer = setTimeout(() => {
    console.log("[Server] Force shutdown");
    for (const socket of sockets) {
      socket.destroy();
    }
    process.exit(1);
  }, 5000);

  try {
    await new Promise((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve()))
    );

    await models.sequelize.close();
    console.log("Database Closed");

    clearTimeout(forceTimer);
    process.exit(0);
  } catch (err) {
    clearTimeout(forceTimer);
    console.error("[Server] Shutdown Error", err);
    process.exit(1);
  }
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
