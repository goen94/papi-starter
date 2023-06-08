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
} from "./connection.js";

export abstract class BaseRepository {
  public db: DatabaseConnection;
  public name: string;

  constructor(db: DatabaseConnection, name: string) {
    this.db = db;
    this.name = name;
  }

  collection() {
    return this.db.collection(this.name);
  }

  abstract create(document: DocumentInterface, options?: CreateOptionsInterface): Promise<CreateResultInterface>;
  abstract createMany(
    documents: Array<DocumentInterface>,
    options?: CreateManyOptionsInterface
  ): Promise<CreateManyResultInterface>;
  abstract retrieve(id: string, options?: RetrieveOptionsInterface): Promise<RetrieveResultInterface>;
  abstract retrieveAll(
    query: QueryInterface,
    options?: RetrieveAllOptionsInterface
  ): Promise<RetrieveAllResultInterface>;
  abstract update(
    id: string,
    document: DocumentInterface,
    options?: UpdateOptionsInterface
  ): Promise<UpdateResultInterface>;
  abstract delete(id: string, options?: DeleteOptionsInterface): Promise<DeleteResultInterface>;
  abstract aggregate(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pipeline: any[],
    query: AggregateQueryInterface,
    options?: AggregateOptionsInterface
  ): Promise<AggregateResultInterface>;
}
