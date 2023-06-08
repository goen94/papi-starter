import { objClean } from "@point-hub/express-utils";
import { ExampleEntity, ExampleStatusTypes } from "../model/example.entity.js";
import { UpdateManyExampleRepository } from "../model/repository/update-many.repository.js";
import { validate } from "../validation/update-many.validation.js";
import DatabaseConnection, { UpdateOptionsInterface, DocumentInterface } from "@src/database/connection.js";

interface UpdateManyResponseInterface {
  // Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined
  acknowledged: boolean;
  // The number of documents that matched the filter
  matchedCount: number;
  // The number of documents that were modified
  modifiedCount: number;
}

export class UpdateManyExampleUseCase {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  public async handle(
    document: DocumentInterface,
    options: UpdateOptionsInterface
  ): Promise<UpdateManyResponseInterface> {
    try {
      // validate request body
      validate(document);

      const exampleEntity = new ExampleEntity({
        status: ExampleStatusTypes.Suspended,
        updatedAt: new Date(),
      });

      const updateResponse = await new UpdateManyExampleRepository(this.db).handle(
        {
          name: {
            $regex: `${document.filter.name}`,
            $options: "i",
          },
        },
        {
          $set: objClean(exampleEntity),
        },
        options
      );

      return {
        acknowledged: updateResponse.acknowledged,
        matchedCount: updateResponse.matchedCount,
        modifiedCount: updateResponse.modifiedCount,
      };
    } catch (error) {
      throw error;
    }
  }
}
