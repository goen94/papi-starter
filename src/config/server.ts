import { config } from "dotenv";
import { setupEnvironment } from "./environment.js";

setupEnvironment(process.env.NODE_ENV as string);
config();

export interface IServerConfig {
  port: number;
}

const serverConfig: IServerConfig = {
  port: Number(process.env.PORT ?? 3000),
};

export default serverConfig;
