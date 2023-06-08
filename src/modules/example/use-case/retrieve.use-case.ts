import { ExampleStatusTypes } from "../model/example.entity.js";
import { RetrieveExampleRepository } from "../model/repository/retrieve.repository.js";
import DatabaseConnection, { RetrieveOptionsInterface } from "@src/database/connection.js";

interface ResponseInterface {
  _id: string;
  name?: string;
  status?: ExampleStatusTypes;
  createdAt?: Date;
}

export class RetrieveExampleUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(id: string, options?: RetrieveOptionsInterface): Promise<ResponseInterface> {
    try {
      const response = await new RetrieveExampleRepository(this.db).handle(id, options);

      return {
        _id: response._id,
        name: response.name,
        status: response.status,
        createdAt: response.createdAt,
      };
    } catch (error) {
      throw error;
    }
  }
}
