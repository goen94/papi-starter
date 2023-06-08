import DatabaseConnection, {
  DocumentInterface,
  UpdateOptionsInterface,
  UpdateResultInterface,
} from "@src/database/connection.js";
import DatabaseManager from "@src/database/database-manager.js";

export class UpdateExampleRepository {
  public databaseManager;

  constructor(databaseConnection: DatabaseConnection) {
    this.databaseManager = new DatabaseManager(databaseConnection, "examples");
  }

  public async handle(
    id: string,
    document: DocumentInterface,
    options?: UpdateOptionsInterface
  ): Promise<UpdateResultInterface> {
    return await this.databaseManager.update(id, document, options);
  }
}
