import { config } from "dotenv";
import { setupEnvironment } from "./environment.js";

setupEnvironment(process.env.NODE_ENV as string);
config();

export interface IMongoDBConfig {
  driver?: "mongodb";
  url?: string;
  name?: string;
}

export interface IDatabaseConfig {
  default: string;
  mongodb: IMongoDBConfig;
  /**
   * Calling dynamic object like will cause typescript error
   *
   * Import databaseConfig from "@src/config/database.js";
   * const url:string = databaseConfig[databaseConfig.default].url;
   *
   * So we added [key: string]: any to solve this issue
   */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const databaseConfig: IDatabaseConfig = {
  default: "mongodb",
  mongodb: {
    driver: "mongodb",
    url: `${process.env.DATABASE_URL}`,
    name: `${process.env.DATABASE_NAME}`,
  },
};

export default databaseConfig;
