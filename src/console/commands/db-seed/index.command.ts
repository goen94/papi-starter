import { BaseCommand } from "@point-hub/express-cli";
import databaseConfig from "@src/config/database.js";
import DatabaseConnection from "@src/database/connection.js";
import MongoDbConnection from "@src/database/mongodb/connection-mongodb.js";

export default class DbSeedCommand extends BaseCommand {
  constructor() {
    super({
      name: "db:seed",
      description: "Seed database",
      summary: "Seed database",
      arguments: [],
      options: [],
    });
  }
  async handle(): Promise<void> {
    const dbConnection = new DatabaseConnection(
      new MongoDbConnection({
        name: databaseConfig[databaseConfig.default].name,
        url: databaseConfig[databaseConfig.default].url,
      })
    );
    dbConnection.database(databaseConfig[databaseConfig.default].name);
    try {
      await dbConnection.open();
      // seed examples colllection
      const { exampleSeeds } = await import("@src/modules/example/model/example.seed.js");
      await dbConnection.collection("examples").deleteAll();
      const exampleData = await dbConnection.collection("examples").createMany(exampleSeeds);
      console.info(`[seed] seeding examples data`, exampleData);
    } catch (error) {
      console.error(error);
    } finally {
      dbConnection.close();
    }
  }
}
