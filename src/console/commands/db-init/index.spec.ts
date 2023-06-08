import { jest } from "@jest/globals";
import DbInitCommand from "./index.command.js";

it("test command", async () => {
  const dbInitCommand = new DbInitCommand();
  const spy = jest.spyOn(dbInitCommand, "handle");
  await dbInitCommand.handle();

  expect(spy).toBeCalled();
});
