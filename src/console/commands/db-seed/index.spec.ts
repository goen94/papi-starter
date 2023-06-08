import { jest } from "@jest/globals";
import SeedCommand from "./index.command.js";

it("test command", async () => {
  const seedCommand = new SeedCommand();
  const spy = jest.spyOn(seedCommand, "handle");
  await seedCommand.handle();

  expect(spy).toBeCalled();
});
