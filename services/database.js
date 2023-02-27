const knex = require("knex");

const dialect = {
	postgres: "postgres",
	mysql: "mysql",
	sqlite: "sqlite",
	mariadb: "mariadb",
};

const checking = async (config) => {
	let queryBuilder;
	let selectDialect;
	const connection = {
		host: config.host,
		port: config.port,
		user: config.user,
		password: config.password,
		database: config.dbName,
	};
	switch (config.dialect) {
		case dialect.postgres:
			selectDialect = dialect.postgres;
			queryBuilder = knex({
				client: "pg",
				connection,
			});
			break;
		case dialect.mysql:
			selectDialect = dialect.mysql;
			queryBuilder = knex({
				client: "mysql",
				connection,
			});
			break;
		case dialect.mariadb:
			selectDialect = dialect.mariadb;
			queryBuilder = knex({
				client: "mysql",
				connection,
			});
			break;
		case dialect.sqlite:
			selectDialect = dialect.sqlite;
			queryBuilder = knex({
				client: "sqlite3",
				connection: {
					filename: config.filename,
				},
				useNullAsDefault: false,
			});
			break;
		default:
			break;
	}

	const startAt = new Date();
	try {
		await queryBuilder.raw("select 1");
		return {
			status: 200,
			responseTime: (new Date() - startAt) / 1000,
			dialect: selectDialect,
		};
	} catch (error) {
		return {
			status: 500,
			responseTime: (new Date() - startAt) / 1000,
			dialect: selectDialect,
			error,
		};
	}
};

module.exports = {
	dialect,
	checking,
};
