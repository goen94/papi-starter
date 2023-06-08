import { faker } from "@faker-js/faker";
import { isValid } from "date-fns";
import request from "supertest";
import { ExampleStatusTypes } from "../model/example.entity.js";
import { createApp } from "@src/app.js";
import { resetDatabase, retrieve } from "@src/test/utils.js";

describe("create an example", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  it("should be able to create an example", async () => {
    const app = await createApp();

    const data = {
      name: faker.name.fullName(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };

    const response = await request(app).post("/v1/examples").send(data);

    // expect http response
    expect(response.statusCode).toEqual(201);

    // expect response json
    expect(response.body._id).toBeDefined();

    // expect recorded data
    const exampleRecord = await retrieve("examples", response.body._id);

    expect(exampleRecord._id).toStrictEqual(response.body._id);
    expect(exampleRecord.name).toStrictEqual(data.name);
    expect(exampleRecord.status).toStrictEqual(ExampleStatusTypes.Active);
    expect(isValid(new Date(exampleRecord.createdAt))).toBeTruthy();
  });
});
