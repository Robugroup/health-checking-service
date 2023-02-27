const checking = async (config) => {
	try {
		const startAt = new Date();
		await config.checking();
		return { status: 200, responseTime: (new Date() - startAt) / 1000 };
	} catch (error) {
		return { status: 500, responseTime: (new Date() - startAt) / 1000 };
	}
};

module.exports = {
	checking,
};
