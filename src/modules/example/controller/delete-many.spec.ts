import request from "supertest";
import ExampleFactory from "../model/example.factory.js";
import { createApp } from "@src/app.js";
import { resetDatabase, retrieve, retrieveAll } from "@src/test/utils.js";

describe("delete many examples", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  it("should be able to delete many examples", async () => {
    const app = await createApp();

    const exampleFactory = new ExampleFactory();
    const resultFactory = await exampleFactory.createMany(3);

    const response = await request(app)
      .post("/v1/examples/delete-many")
      .send({
        listId: [resultFactory.insertedIds[0], resultFactory.insertedIds[1]],
      });

    // expect http response
    expect(response.statusCode).toEqual(204);

    // expect response json
    expect(response.body).toStrictEqual({});

    // expect recorded data
    const exampleRecord1 = await retrieve("examples", resultFactory.insertedIds[0]);
    expect(exampleRecord1).toBeNull();
    const exampleRecord2 = await retrieve("examples", resultFactory.insertedIds[1]);
    expect(exampleRecord2).toBeNull();

    const exampleRecords = await retrieveAll("examples");
    expect(exampleRecords.length).toStrictEqual(1);
  });
});
