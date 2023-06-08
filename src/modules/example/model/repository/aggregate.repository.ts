import DatabaseConnection, {
  AggregateResultInterface,
  AggregateQueryInterface,
  AggregateOptionsInterface,
} from "@src/database/connection.js";
import DatabaseManager from "@src/database/database-manager.js";

export class AggregateExampleRepository {
  public databaseManager;

  constructor(databaseConnection: DatabaseConnection) {
    this.databaseManager = new DatabaseManager(databaseConnection, "examples");
  }
  public async aggregate(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pipeline: any[],
    query: AggregateQueryInterface,
    options?: AggregateOptionsInterface
  ): Promise<AggregateResultInterface> {
    return await this.databaseManager.aggregate(pipeline, query, options);
  }
}
