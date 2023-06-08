import databaseConfig from "./database.js";

it("should be defined", async () => {
  expect(databaseConfig.default).toBeDefined();
  expect(typeof databaseConfig.default === "string").toBeTruthy();

  expect(databaseConfig.mongodb.driver).toBeDefined();
  expect(databaseConfig.mongodb.url).toBeDefined();
  expect(databaseConfig.mongodb.name).toBeDefined();
  expect(typeof databaseConfig.mongodb.driver === "string").toBeTruthy();
  expect(typeof databaseConfig.mongodb.url === "string").toBeTruthy();
  expect(typeof databaseConfig.mongodb.name === "string").toBeTruthy();
});
