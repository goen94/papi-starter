import { config } from "dotenv";
import { setupEnvironment } from "./environment.js";

setupEnvironment(process.env.NODE_ENV as string);
config();

export interface IAppConfig {
  name: string;
}

const appConfig: IAppConfig = {
  name: `${process.env.APP_NAME}`,
};

export default appConfig;
