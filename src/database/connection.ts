export interface DocumentInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface QueryInterface {
  fields: string;
  excludeFields?: string[];
  filter: { [key: string]: unknown };
  page: number;
  pageSize: number;
  sort: string;
}

export interface OptionsInterface {
  session?: unknown;
}
export type CreateOptionsInterface = OptionsInterface;
export type CreateManyOptionsInterface = OptionsInterface;
export interface RetrieveOptionsInterface extends OptionsInterface {
  projection?: unknown;
}
export type RetrieveAllOptionsInterface = OptionsInterface;
export type UpdateOptionsInterface = OptionsInterface;
export type UpdateManyOptionsInterface = OptionsInterface;
export type DeleteOptionsInterface = OptionsInterface;
export type DeleteManyOptionsInterface = OptionsInterface;
export type AggregateOptionsInterface = OptionsInterface;

export interface CreateResultInterface {
  _id: string;
  acknowledged: boolean;
}

export interface CreateManyResultInterface {
  acknowledged: boolean;
  insertedCount: number;
  insertedIds: Array<string>;
}

export interface RetrieveResultInterface {
  _id: string;
  [key: string]: unknown;
}

export interface RetrieveAllResultInterface {
  data: Array<RetrieveResultInterface>;
  pagination: {
    page: number;
    pageCount: number;
    pageSize: number;
    totalDocument: number;
  };
}

export interface UpdateResultInterface {
  acknowledged: boolean;
  matchedCount: number;
  modifiedCount: number;
}

export interface UpdateManyResultInterface {
  acknowledged: boolean;
  matchedCount: number;
  modifiedCount: number;
}

export interface DeleteResultInterface {
  acknowledged: boolean;
  deletedCount: number;
}

export interface DeleteManyResultInterface {
  acknowledged: boolean;
  deletedCount: number;
}

export interface AggregateQueryInterface {
  page: number;
  pageSize: number;
}

export interface AggregateResultInterface {
  data: Array<RetrieveResultInterface>;
  pagination: {
    page: number;
    pageCount: number;
    pageSize: number;
    totalDocument: number;
  };
}

export interface IDatabaseAdapter {
  session: unknown;
  url(): string;
  open(): Promise<void>;
  close(): Promise<void>;
  database(name: string, options?: unknown): this;
  listCollections(): Promise<Array<{ name: string }>>;
  collection(name: string, options?: unknown): this;
  createIndex(name: string, spec: unknown, options?: unknown): Promise<void>;
  createCollection(name: string, options?: unknown): Promise<void>;
  createCollections(): Promise<void>;
  dropCollection(name: string, options?: unknown): Promise<void>;
  dropCollections(): Promise<void>;
  updateSchema(name: string, schema: unknown): Promise<void>;
  startSession(): unknown;
  endSession(): Promise<this>;
  startTransaction(): this;
  commitTransaction(): Promise<this>;
  abortTransaction(): Promise<this>;
  create(document: DocumentInterface, options?: CreateOptionsInterface): Promise<CreateResultInterface>;
  createMany(documents: Array<DocumentInterface>, options?: CreateOptionsInterface): Promise<CreateManyResultInterface>;
  retrieve(id: string, options?: RetrieveOptionsInterface): Promise<RetrieveResultInterface>;
  retrieveAll(query: QueryInterface, options?: RetrieveAllOptionsInterface): Promise<RetrieveAllResultInterface>;
  update(id: string, document: DocumentInterface, options?: UpdateOptionsInterface): Promise<UpdateResultInterface>;
  updateMany(
    filter: DocumentInterface,
    documents: DocumentInterface,
    options?: UpdateManyOptionsInterface
  ): Promise<UpdateManyResultInterface>;
  delete(id: string, options?: DeleteOptionsInterface): Promise<DeleteResultInterface>;
  deleteMany(filter: DocumentInterface, options?: DeleteManyOptionsInterface): Promise<DeleteManyResultInterface>;
  deleteAll(options?: DeleteManyOptionsInterface): Promise<DeleteManyResultInterface>;
  aggregate(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pipeline: any[],
    query: AggregateQueryInterface,
    options?: AggregateOptionsInterface
  ): Promise<AggregateResultInterface>;
}

export default class DatabaseConnection {
  private adapter: IDatabaseAdapter;

  constructor(adapter: IDatabaseAdapter) {
    this.adapter = adapter;
  }

  public url(): string {
    return this.adapter.url();
  }

  public async open(): Promise<void> {
    await this.adapter.open();
  }

  public async close(): Promise<void> {
    await this.adapter.close();
  }

  public database(name: string): this {
    this.adapter.database(name);
    return this;
  }

  public listCollections(): Promise<Array<{ name: string }>> {
    return this.adapter.listCollections();
  }

  public collection(name: string): this {
    this.adapter.collection(name);
    return this;
  }

  public startSession() {
    this.adapter.startSession();
    return this.adapter.session;
  }

  public async endSession() {
    await this.adapter.endSession();
    return this;
  }

  public startTransaction() {
    this.adapter.startTransaction();
    return this;
  }

  public async commitTransaction() {
    await this.adapter.commitTransaction();
    return this;
  }

  public async abortTransaction() {
    await this.adapter.abortTransaction();
    return this;
  }

  public createIndex(name: string, spec: unknown, options?: unknown) {
    this.adapter.createIndex(name, spec, options);
  }

  public async createCollection(name: string, options?: unknown) {
    await this.adapter.createCollection(name, options);
  }

  public async dropCollection(name: string, options?: unknown) {
    await this.adapter.dropCollection(name, options);
  }

  public async updateSchema(name: string, schema: unknown) {
    await this.adapter.updateSchema(name, schema);
  }

  /**
   * Create Collections
   * ==================
   * Create new collection if not exists and update schema validation or indexes
   */
  public async createCollections() {
    await this.adapter.createCollections();
  }

  /**
   * Drop Collections
   * ==================
   * Drop collections function is for testing purpose, so every test can generate fresh database
   */
  public async dropCollections() {
    await this.adapter.dropCollections();
  }

  public async create(document: DocumentInterface, options?: CreateOptionsInterface): Promise<CreateResultInterface> {
    return await this.adapter.create(document, options);
  }

  public async createMany(
    documents: Array<DocumentInterface>,
    options?: CreateManyOptionsInterface
  ): Promise<CreateManyResultInterface> {
    return await this.adapter.createMany(documents, options);
  }

  public async retrieve(id: string, options?: RetrieveOptionsInterface): Promise<RetrieveResultInterface> {
    return await this.adapter.retrieve(id, options);
  }

  public async retrieveAll(
    query: QueryInterface,
    options?: RetrieveAllOptionsInterface
  ): Promise<RetrieveAllResultInterface> {
    return await this.adapter.retrieveAll(query, options);
  }

  public async update(
    id: string,
    document: DocumentInterface,
    options?: UpdateOptionsInterface
  ): Promise<UpdateResultInterface> {
    return await this.adapter.update(id, document, options);
  }

  public async updateMany(
    filter: DocumentInterface,
    document: DocumentInterface,
    options?: UpdateManyOptionsInterface
  ): Promise<UpdateManyResultInterface> {
    return await this.adapter.updateMany(filter, document, options);
  }

  public async delete(id: string, options?: DeleteOptionsInterface): Promise<DeleteResultInterface> {
    return await this.adapter.delete(id, options);
  }

  public async deleteMany(
    filter: DocumentInterface,
    options?: DeleteManyOptionsInterface
  ): Promise<DeleteManyResultInterface> {
    return await this.adapter.deleteMany(filter, options);
  }

  public async deleteAll(options?: DeleteManyOptionsInterface): Promise<DeleteManyResultInterface> {
    return await this.adapter.deleteAll(options);
  }

  public async aggregate(
    pipeline: unknown[],
    query: AggregateQueryInterface,
    options?: AggregateOptionsInterface
  ): Promise<AggregateResultInterface> {
    return await this.adapter.aggregate(pipeline, query, options);
  }
}
