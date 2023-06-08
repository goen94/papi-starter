import { isValid } from "date-fns";
import request from "supertest";
import { ExampleStatusTypes } from "../model/example.entity.js";
import ExampleFactory from "../model/example.factory.js";
import { createApp } from "@src/app.js";
import { resetDatabase, retrieveAll } from "@src/test/utils.js";

describe("retrieve all examples", () => {
  beforeEach(async () => {
    await resetDatabase();
  });
  it("should be able to retrieve all examples", async () => {
    const app = await createApp();

    const exampleFactory = new ExampleFactory();
    await exampleFactory.createMany(3);

    const data = await retrieveAll("examples");

    const response = await request(app).get(`/v1/examples`);

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.examples.length).toStrictEqual(3);
    expect(response.body.examples[0]._id).toBeDefined();
    expect(response.body.examples[0].name).toStrictEqual(data[0].name);
    expect(response.body.examples[0].status).toStrictEqual(ExampleStatusTypes.Active);
    expect(isValid(new Date(response.body.examples[0].createdAt))).toBeTruthy();
    expect(response.body.examples[1].name).toStrictEqual(data[1].name);
    expect(response.body.examples[2].name).toStrictEqual(data[2].name);

    expect(response.body.pagination.page).toStrictEqual(1);
    expect(response.body.pagination.pageSize).toStrictEqual(10);
    expect(response.body.pagination.pageCount).toStrictEqual(1);
    expect(response.body.pagination.totalDocument).toStrictEqual(3);
  });
  it("should be able to sort data in ascending order", async () => {
    const app = await createApp();

    const exampleFactory = new ExampleFactory();
    const data = [
      {
        name: "John Doe",
      },
      {
        name: "Charles",
      },
      {
        name: "Jane",
      },
    ];
    exampleFactory.sequence(data);
    await exampleFactory.createMany(3);

    const response = await request(app).get(`/v1/examples`).query({
      sort: "name",
    });

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.examples.length).toStrictEqual(3);
    expect(response.body.examples[0].name).toStrictEqual(data[1].name);
    expect(response.body.examples[1].name).toStrictEqual(data[2].name);
    expect(response.body.examples[2].name).toStrictEqual(data[0].name);

    expect(response.body.pagination.page).toStrictEqual(1);
    expect(response.body.pagination.pageSize).toStrictEqual(10);
    expect(response.body.pagination.pageCount).toStrictEqual(1);
    expect(response.body.pagination.totalDocument).toStrictEqual(3);
  });
  it("should be able to sort data in descending order", async () => {
    const app = await createApp();

    const exampleFactory = new ExampleFactory();
    const data = [
      {
        name: "John Doe",
      },
      {
        name: "Charles",
      },
      {
        name: "Jane",
      },
    ];
    exampleFactory.sequence(data);
    await exampleFactory.createMany(3);

    const response = await request(app).get(`/v1/examples`).query({
      sort: "-name",
    });

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.examples.length).toStrictEqual(3);
    expect(response.body.examples[0].name).toStrictEqual(data[0].name);
    expect(response.body.examples[1].name).toStrictEqual(data[2].name);
    expect(response.body.examples[2].name).toStrictEqual(data[1].name);

    expect(response.body.pagination.page).toStrictEqual(1);
    expect(response.body.pagination.pageSize).toStrictEqual(10);
    expect(response.body.pagination.pageCount).toStrictEqual(1);
    expect(response.body.pagination.totalDocument).toStrictEqual(3);
  });
  it("should be able to navigate pagination", async () => {
    const app = await createApp();

    const exampleFactory = new ExampleFactory();
    await exampleFactory.createMany(3);

    const data = await retrieveAll("examples");

    const response = await request(app).get(`/v1/examples`).query({
      page: 2,
      pageSize: 2,
    });

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.examples.length).toStrictEqual(1);
    expect(response.body.examples[0].name).toStrictEqual(data[2].name);

    expect(response.body.pagination.page).toStrictEqual(2);
    expect(response.body.pagination.pageSize).toStrictEqual(2);
    expect(response.body.pagination.pageCount).toStrictEqual(2);
    expect(response.body.pagination.totalDocument).toStrictEqual(3);
  });
  it("should be able to choose fields", async () => {
    const app = await createApp();

    const exampleFactory = new ExampleFactory();
    await exampleFactory.createMany(3);

    const data = await retrieveAll("examples");

    const response = await request(app).get(`/v1/examples`).query({
      fields: "name",
    });

    // expect http response
    expect(response.statusCode).toEqual(200);

    // expect response json
    expect(response.body.examples.length).toStrictEqual(3);
    expect(response.body.examples[0]._id).toBeDefined();
    expect(response.body.examples[1]._id).toBeDefined();
    expect(response.body.examples[2]._id).toBeDefined();
    expect(response.body.examples[0].name).toStrictEqual(data[0].name);
    expect(response.body.examples[1].name).toStrictEqual(data[1].name);
    expect(response.body.examples[2].name).toStrictEqual(data[2].name);
    expect(response.body.examples[0].status).toBeUndefined();
    expect(response.body.examples[1].status).toBeUndefined();
    expect(response.body.examples[2].status).toBeUndefined();
    expect(response.body.examples[0].createdAt).toBeUndefined();
    expect(response.body.examples[1].createdAt).toBeUndefined();
    expect(response.body.examples[2].createdAt).toBeUndefined();

    expect(response.body.pagination.page).toStrictEqual(1);
    expect(response.body.pagination.pageSize).toStrictEqual(10);
    expect(response.body.pagination.pageCount).toStrictEqual(1);
    expect(response.body.pagination.totalDocument).toStrictEqual(3);
  });
});
