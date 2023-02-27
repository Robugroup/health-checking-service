const Minio = require("minio");
const AWS = require("aws-sdk");

const dialect = {
	aws: "aws",
	minio: "minio",
};

const checking = async (config) => {
	const startAt = new Date();
	switch (config.dialect) {
		case dialect.minio:
			try {
				await new Minio.Client({
					endPoint: config.endPoint,
					accessKey: config.accessKey,
					secretKey: config.secretKey,
				}).listBuckets();
				return {
					status: 200,
					responseTime: (new Date() - startAt) / 1000,
					dialect: dialect.minio,
				};
			} catch (error) {
				return {
					error,
					status: 500,
					responseTime: (new Date() - startAt) / 1000,
					dialect: dialect.minio,
				};
			}
		case dialect.aws:
			try {
				await new Promise((resolve, reject) => {
					new AWS.S3({
						region: config.region || "us-east-1",
						secretAccessKey: config.accessKey,
						accessKeyId: config.secretKey,
					}).listBuckets((error) => {
						if (error) return reject(error);
						resolve();
					});
				});
				return {
					status: 200,
					responseTime: (new Date() - startAt) / 1000,
					dialect: dialect.aws,
				};
			} catch (error) {
				return {
					error,
					status: 500,
					responseTime: (new Date() - startAt) / 1000,
					dialect: dialect.aws,
				};
			}
	}
};

module.exports = {
	checking,
	dialect,
};
