# health-checking-service

<div align="center">

![test](https://github.com/gritzkoo/nodejs-health-checker/workflows/test/badge.svg?branch=master)
![GitHub Workflow Status (event)](https://img.shields.io/github/workflow/status/gritzkoo/nodejs-health-checker/test)
[![Coverage Status](https://coveralls.io/repos/github/gritzkoo/nodejs-health-checker/badge.svg?branch=master)](https://coveralls.io/github/gritzkoo/nodejs-health-checker?branch=master)
[![License Status](https://img.shields.io/github/license/gritzkoo/nodejs-health-checker)](https://img.shields.io/github/license/gritzkoo/nodejs-health-checker)
[![Issues Status](https://img.shields.io/github/issues/gritzkoo/nodejs-health-checker)](https://img.shields.io/github/issues/gritzkoo/nodejs-health-checker)

</div>

This is a Node package that allows you to track the health of your application, providing two ways of checking:

*__Simple__*: will respond to a JSON as below and that allows you to check if your application is online and responding without checking any kind of integration.

```json
{
  "status": "pong"
}
```

*__Detailed__*: will respond a JSON as below and that allows you to check if your application is up and running and check if all of your integrations informed in the configuration list is up and running.

```json
{
	"name": "example",
	"version": "v1.0.0",
	"status": false,
	"date": "2022-09-23T07:26:51.369Z",
	"duration": 0.221,
	"integrations": [
		{
			"name": "local-redis",
			"type": "Redis integration",
			"url": "xxxxxxxxxxxx",
			"status": 200,
			"responseTime": 0.006
		},
		{
			"name": "ui api service",
			"type": "Web service integration",
			"url": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
			"status": 403,
			"responseTime": 0.215,
			"error": {
				"action_type": 2,
				"error": 90309999,
				"is_customized": false
			}
		},
		{
			"name": "local-timescale",
			"type": "Database integration",
			"url": "xxxxxxxxxxxx",
			"status": 200,
			"responseTime": 0.044,
			"dialect": "postgres"
		},
		{
			"name": "local-postgres",
			"type": "Database integration",
			"url": "xxxxxxxxxxxx",
			"status": 200,
			"responseTime": 0.162,
			"dialect": "postgres"
		},
		{
			"name": "dev-mariadb",
			"type": "Database integration",
			"url": "xxxxxxxxxxxx",
			"status": 200,
			"responseTime": 0.157,
			"dialect": "mariadb"
		},
		{
			"name": "staging-mysql",
			"type": "Database integration",
			"url": "xxxxxxxxxxxx",
			"status": 200,
			"responseTime": 0.22,
			"dialect": "mysql"
		},
		{
			"name": "local-sqlite",
			"type": "Database integration",
			"status": 200,
			"responseTime": 0.004,
			"dialect": "sqlite"
		},
		{
			"name": "dev-sqlite",
			"type": "Database integration",
			"status": 200,
			"responseTime": 0.004,
			"dialect": "sqlite"
		},
		{
			"name": "minio",
			"type": "Object storage integration",
			"url": "xxxxxxxxxxxxxxxxxxxxxxx",
			"status": 200,
			"responseTime": 0.131,
			"dialect": "minio"
		},
		{
			"name": "s3",
			"type": "Object storage integration",
			"url": "xxxxxxxxxxxxxxxxxxxxxxx",
			"status": 200,
			"responseTime": 0.133,
			"dialect": "aws"
		}
	]
}
```

## How to install

```sh
npm i health-checking-service
```

## Available integrations

- [X] Redis
- [X] Web service integration
- [X] Object storage integration (s3, minio)
- [X] Database integration (postgres, mysql, mariadb, sqlite)
- [X] Custom integration support

## How to use

Example using Nodejs + Express

```typescript
const express = require('express');
const {
    detailChecking, simpleChecking, healthType, healthDialect,
} = require("health-checking-service");

const app = express();

app.get('/health-check/', (req, res) => {
    res.json({ status: "I'm alive!" });
})
app.get('/health-check/liveness', (req, res) => {
    res.json(simpleChecking())
})
app.get('/health-check/readiness', async (req, res) => {
    const result = await detailChecking({
	name: "example",
	version: "v1.0.0",
	integrations: [
		{
			type: healthType.REDIS,
			name: "local-redis",
			host: "xxxxxxxxxx",
			port: 6379,
		},
		{
			type: healthType.WEB_SERVICE,
			name: "api service",
			host: "https://xxxxxxxxxxx/",
			headers: [
				{ key: "Accept", value: "application/json" },
				{
					key: "Authorization",
					value: "Bearer ey......",
				},
			],
		},
		{
			type: healthType.DATABASE,
			name: "local-postgres",
			host: "xxxxxxxxxx",
			port: 5432,
			dbName: "xxxxxxxxxx",
			user: "xxxxxxxxxx",
			password: "xxxxxxxxxx",
			dialect: healthDialect.DATABASE.postgres,
		},
		{
			type: healthType.DATABASE,
			name: "local-mariadb",
			host: "localhost",
			port: 3306,
			dbName: "xxxxxxxxxx",
			user: "xxxxxxxxxx",
			password: "xxxxxxxxxx",
			dialect: healthDialect.DATABASE.mariadb,
		},
		{
			type: healthType.DATABASE,
			name: "local-mariadb",
			host: "localhost",
			port: 3306,
			dbName: "xxxxxxxxxx",
			user: "xxxxxxxxxx",
			password: "xxxxxxxxxx",
			dialect: healthDialect.DATABASE.mysql,
		},
		{
			type: healthType.DATABASE,
			name: "local-sqlite",
			filename: "path to .sqlite file",
			dialect: healthDialect.DATABASE.sqlite,
		},
		{
			type: healthType.OBJECT_STORAGE,
			name: "minio",
			endPoint: "xxxxxxxxxx",
			accessKey: "xxxxxxxxxx",
			secretKey: "xxxxxxxxxx",
			dialect: healthDialect.OBJECT_STORAGE.minio,
		},
		{
			type: healthType.OBJECT_STORAGE,
			name: "s3",
			endPoint: "xxxxxxxxxx",
			accessKey: "xxxxxxxxxx",
			secretKey: "xxxxxxxxxx",
			region: "xxxxxxxxx",
			dialect: healthDialect.OBJECT_STORAGE.aws,
		},
		{
			type: healthType.CUSTOM,
			name: "custom",
			checking: async () => {
				// do some thing
				return {
					status: 200, // || 500
					responseTime: 0,
					error: "",
				};
			},
		},
	],
});
    res.json(result);
})
app.listen(3000, () => {
    console.log('server started at port 3000')
})
```
