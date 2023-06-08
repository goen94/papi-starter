import DatabaseConnection, {
  DocumentInterface,
  QueryInterface,
  CreateResultInterface,
  RetrieveResultInterface,
  RetrieveAllResultInterface,
  UpdateResultInterface,
  DeleteResultInterface,
  CreateOptionsInterface,
  RetrieveOptionsInterface,
  RetrieveAllOptionsInterface,
  UpdateOptionsInterface,
  DeleteOptionsInterface,
  AggregateOptionsInterface,
  AggregateQueryInterface,
  AggregateResultInterface,
  CreateManyResultInterface,
  CreateManyOptionsInterface,
  UpdateManyOptionsInterface,
  UpdateManyResultInterface,
} from "./connection.js";

export default class DatabaseManager {
  public databaseConnection: DatabaseConnection;
  public collectionName: string;

  constructor(databaseConnection: DatabaseConnection, collectionName: string) {
    this.databaseConnection = databaseConnection;
    this.collectionName = collectionName;
  }

  private collection() {
    return this.databaseConnection.collection(this.collectionName);
  }

  public async create(document: DocumentInterface, options?: CreateOptionsInterface): Promise<CreateResultInterface> {
    return await this.collection().create(document, options);
  }

  public async createMany(
    documents: Array<DocumentInterface>,
    options?: CreateManyOptionsInterface
  ): Promise<CreateManyResultInterface> {
    return await this.collection().createMany(documents, options);
  }

  public async retrieve(id: string, options?: RetrieveOptionsInterface): Promise<RetrieveResultInterface> {
    return await this.collection().retrieve(id, options);
  }

  public async retrieveAll(
    query: QueryInterface,
    options?: RetrieveAllOptionsInterface
  ): Promise<RetrieveAllResultInterface> {
    return await this.collection().retrieveAll(query, options);
  }

  public async update(
    id: string,
    document: DocumentInterface,
    options?: UpdateOptionsInterface
  ): Promise<UpdateResultInterface> {
    return await this.collection().update(id, document, options);
  }

  public async updateMany(
    filter: DocumentInterface,
    document: DocumentInterface,
    options?: UpdateManyOptionsInterface
  ): Promise<UpdateManyResultInterface> {
    return await this.collection().updateMany(filter, document, options);
  }

  public async delete(id: string, options?: DeleteOptionsInterface): Promise<DeleteResultInterface> {
    return await this.collection().delete(id, options);
  }

  public async deleteMany(filter: DocumentInterface, options?: DeleteOptionsInterface): Promise<DeleteResultInterface> {
    return await this.collection().deleteMany(filter, options);
  }

  public async aggregate(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pipeline: any[],
    query: AggregateQueryInterface,
    options?: AggregateOptionsInterface
  ): Promise<AggregateResultInterface> {
    return await this.collection().aggregate(pipeline, query, options);
  }
}
