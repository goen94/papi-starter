import DatabaseConnection from "./connection.js";
import MongoDbConnection from "./mongodb/connection-mongodb.js";
import databaseConfig from "@src/config/database.js";

const dbConnection = new DatabaseConnection(
  new MongoDbConnection({
    url: databaseConfig[databaseConfig.default].url,
    name: databaseConfig[databaseConfig.default].name,
  })
);

try {
  await dbConnection.open();
  dbConnection.database(databaseConfig[databaseConfig.default].name);
} catch (error) {
  throw error;
}

export const db = dbConnection;
