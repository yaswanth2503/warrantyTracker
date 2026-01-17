#!/usr/bin/env node
const app = require('../app.js');
const env = process.env.NODE_ENV || "development";
const config = require('../config/db.json')[env];

app.set("port", config.appPort || 4000);

const server = app.listen(app.get("port"), () => {
	console.log(`[Client] Listening on port ${app.get("port")}`);
});

server.setTimeout(1000 * 60 * 2);

const gracefulShutdown = async () => {
	console.log(`[Client] Shutting down...`);
	const forceExit = setTimeout(() => {
		console.error("[Client] Shutdown timed out. Forcing exit.");
		process.exit(1);
	}, 10000);

	try {
		await new Promise((resolve, reject) => {
			server.close((err) => {
				if (err) return reject(err);
				resolve();
			});
		});

		console.log("[Client] Server closed successfully.");
	} catch (err) {
		console.error("[Client] Error during shutdown:", err);
	} finally {
		clearTimeout(forceExit);
		process.exit(0);
	}
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);