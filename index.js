const express = require("express");
const expressConfig = require("./config/expressConfig");
const databaseConfig = require("./config/databaseConfig");
const routesConfig = require("./config/routesConfig");
const seedData = require("./config/seedDataConfig");

const SERVER_PORT = 3000;

start();

async function start() {
  const app = express();

  await databaseConfig(app);
  await seedData(app);

  expressConfig(app);
  routesConfig(app);

  app.listen(SERVER_PORT, () =>
    console.log(`Server listening on port ${SERVER_PORT}`)
  );
}
