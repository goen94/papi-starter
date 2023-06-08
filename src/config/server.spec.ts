import serverConfig from "./server.js";

it("should be defined", async () => {
  expect(serverConfig.port).toBeDefined();
  expect(typeof serverConfig.port === "number").toBeTruthy();
});
