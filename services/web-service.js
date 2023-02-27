const parseError = (...args) =>
import("parse-json-object").then(({ default: parseJSONObject}) => parseJSONObject(...args));

const fetch = (...args) =>
import("node-fetch").then(({ default: fetch }) => fetch(...args));

const checking = async (config) => {
	let headers = [];
	if (Array.isArray(config.headers)) {
		headers = config.headers.map((item) => [item.key, item.value]);
	}

	const startAt = new Date();
	let data;
	try {
		data = await fetch(config.host, {
			headers,
		});
	} catch (error) {
		return {
			error,
			status: data.status,
			responseTime: (new Date() - startAt) / 1000,
		};
	}

	return {
		status: data.status,
		responseTime: (new Date() - startAt) / 1000,
		error:
			data.status !== 200
				? await (async () => {
						let error = await data.text();
						try {
							error = parseError(error);
						} catch (error) {}
						return error;
				  })()
				: undefined,
	};
};

module.exports = {
	checking,
};
