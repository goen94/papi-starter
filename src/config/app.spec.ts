import appConfig from "./app.js";

it("should be defined", async () => {
  expect(appConfig.name).toBeDefined();
  expect(typeof appConfig.name === "string").toBeTruthy();
});
