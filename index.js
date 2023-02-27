const fs = require("fs");
const _ = require("lodash");

const services = [];
const healthType = {};
const healthDialect = {};
for (const serviceFile of fs.readdirSync(__dirname + "/services")) {
	const serviceName = _.camelCase(serviceFile.replace(".js", ""));
	const serviceTypeName = _.snakeCase(serviceName).toUpperCase();
	const service = require(__dirname + `/services/${serviceFile}`);

	healthType[serviceTypeName] = serviceTypeName;
	healthDialect[serviceTypeName] = service.dialect;
	services.push({
		name: serviceName,
		type: serviceTypeName,
		kind: `${_.capitalize(_.startCase(serviceName))} integration`,
		...service,
	});
}

const simpleChecking = () => ({ status: "pong" });

const detailChecking = async (config) => {
	const { name, version, integrations } = config;
	let result = {
		name,
		version,
		status: false,
		date: new Date(),
		duration: new Date(),
		integrations: [],
	};
	const processes = [];
	if (Array.isArray(integrations)) {
		for (const integration of integrations) {
			let service = services.find((item) => item.type === integration.type);
			if (!service) {
				service = services.find((item) => item.type === healthType.custom);
			}
			processes.push(service.checking(integration));
			result.integrations.push({
				name: integration.name,
				type: service.kind,
				url: integration.host || integration.endPoint,
			});
		}
		const checkingResults = await Promise.all(processes);
		result.integrations = result.integrations.map((item, index) => ({
			...item,
			...checkingResults[index],
		}));
	}

	result.duration = (new Date() - result.duration) / 1000;
	result.status = result.integrations.every((item) => item.status === 200);
	return result;
};

module.exports = {
	healthType,
	healthDialect,
	detailChecking,
	simpleChecking,
};
