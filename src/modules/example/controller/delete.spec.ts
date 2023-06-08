import request from "supertest";
import ExampleFactory from "../model/example.factory.js";
import { createApp } from "@src/app.js";
import { resetDatabase, retrieve, retrieveAll } from "@src/test/utils.js";

describe("delete an example", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  it("should be able to delete an example", async () => {
    const app = await createApp();

    const exampleFactory = new ExampleFactory();
    const resultFactory = await exampleFactory.createMany(3);

    const response = await request(app).delete(`/v1/examples/${resultFactory.insertedIds[1]}`);

    // expect http response
    expect(response.statusCode).toEqual(204);

    // expect response json
    expect(response.body).toStrictEqual({});

    // expect recorded data
    const exampleRecord = await retrieve("examples", resultFactory.insertedIds[1]);
    expect(exampleRecord).toBeNull();

    const exampleRecords = await retrieveAll("examples");
    expect(exampleRecords.length).toStrictEqual(2);
  });
});
