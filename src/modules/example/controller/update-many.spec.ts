import { isValid } from "date-fns";
import request from "supertest";
import ExampleFactory from "../model/example.factory.js";
import { createApp } from "@src/app.js";
import { resetDatabase, retrieve } from "@src/test/utils.js";

describe("update many examples", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  it("should be able to update many examples", async () => {
    const app = await createApp();

    const exampleFactory = new ExampleFactory();
    const exampleData = [
      {
        name: "i'am robot",
      },
      {
        name: "Me RoboT",
      },
      {
        name: "Normal Example",
      },
    ];
    exampleFactory.sequence(exampleData);
    const resultFactory = await exampleFactory.createMany(3);

    // suspend every example data with name robot
    const response = await request(app)
      .post("/v1/examples/update-many")
      .send({
        filter: {
          name: "robot",
        },
      });

    // expect http response
    expect(response.statusCode).toEqual(204);

    // expect response json
    expect(response.body).toStrictEqual({});

    // expect recorded data
    const exampleRecord1 = await retrieve("examples", resultFactory.insertedIds[0]);
    expect(exampleRecord1.status).toStrictEqual("suspended");
    expect(isValid(new Date(exampleRecord1.updatedAt))).toBeTruthy();

    const exampleRecord2 = await retrieve("examples", resultFactory.insertedIds[1]);
    expect(exampleRecord2.status).toStrictEqual("suspended");
    expect(isValid(new Date(exampleRecord2.updatedAt))).toBeTruthy();

    const exampleRecord3 = await retrieve("examples", resultFactory.insertedIds[2]);
    expect(exampleRecord3.status).toStrictEqual("active");
    expect(isValid(new Date(exampleRecord3.updatedAt))).toBeFalsy();
  });
});
