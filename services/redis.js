const { createClient } = require("redis");

const checking = (config) =>
	new Promise(async (resolve, reject) => {
		const client = createClient({
			host: config.host,
			port: config.port,
			password: config.password,
		});
		const startAt = new Date();
		client.on("error", (error) => {
			client.end(true);
			reject({ status: 500, responseTime: (new Date() - startAt) / 1000 });
		});
		client.ping((status) => {
			client.end(true);
			resolve({
				status: !status ? 200 : 500,
				responseTime: (new Date() - startAt) / 1000,
			});
		});
	});

module.exports = {
	checking,
};
