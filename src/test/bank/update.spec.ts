import request from "supertest";
import { bankData } from "./constant";
import { createApp } from "@src/app.js";
import { db } from "@src/database/database.js";

const updateData = {
  name: "MANDIRI",
  code: "015",
};

describe("update bank", () => {
  let _id = "";
  beforeEach(async () => {
    const app = await createApp();
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2023",
    });
    const accessToken = authResponse.body.accessToken;
    const response = await request(app).post("/v1/banks").send(bankData).set("Authorization", `Bearer ${accessToken}`);
    _id = response.body._id;
  });
  it("should check user is authorized", async () => {
    const app = await createApp();
    const response = await request(app)
      .patch("/v1/banks/" + _id)
      .send({});
    expect(response.statusCode).toEqual(401);
    expect(response.body.code).toBe(401);
    expect(response.body.status).toBe("Unauthorized");
    expect(response.body.message).toBe("Authentication credentials is invalid.");
  });
  it("should check user have permission to access", async () => {
    const app = await createApp();
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "user",
      password: "user2023",
    });
    const accessToken = authResponse.body.accessToken;

    const response = await request(app)
      .patch("/v1/banks/" + _id)
      .send({})
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(403);
    expect(response.body.code).toBe(403);
    expect(response.body.status).toBe("Forbidden");
    expect(response.body.message).toBe("Don't have necessary permissions for this resource.");
  });
  it("should check required fields", async () => {
    const app = await createApp();
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2023",
    });
    const accessToken = authResponse.body.accessToken;

    const response = await request(app)
      .patch("/v1/banks/" + _id)
      .send({})
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toEqual(422);
    expect(response.body.code).toBe(422);
    expect(response.body.message).toBe("Unprocessable Entity");
    expect(response.body.message).toBe(
      "The request was well-formed but was unable to be followed due to semantic errors."
    );
    expect(response.body.errors.name).toBe(["name is required"]);
    expect(response.body.errors.code).toBe(["code is required"]);
  });
  it("should check unique fields", async () => {
    const app = await createApp();
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2023",
    });
    const accessToken = authResponse.body.accessToken;

    const newData = {
      name: "MANDIRI",
      code: "015",
      address: "21 Street",
      phone: "08123456789",
      fax: "03617070",
      notes: "this is note",
      accounts: [
        {
          branch: "Mayjend Sungkono",
          number: 86401234,
          name: "John Doe",
          notes: "",
        },
        {
          branch: "Raya Darmo",
          number: 85543210,
          name: "John Doe",
          notes: "",
        },
      ],
    };
    await request(app).post("/v1/banks").send(newData).set("Authorization", `Bearer ${accessToken}`);

    const response = await request(app)
      .patch("/v1/banks/" + _id)
      .send(updateData)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(422);
    expect(response.body.code).toBe(422);
    expect(response.body.status).toBe("Unprocessable Entity");
    expect(response.body.message).toBe(
      "The request was well-formed but was unable to be followed due to semantic errors."
    );
    expect(response.body.errors.code).toBe(["code is exists"]);
    expect(response.body.errors.name).toBe(["name is exists"]);
  });
  it("should save to database", async () => {
    const app = await createApp();
    const authResponse = await request(app).patch("/v1/auth/signin").send({
      username: "admin",
      password: "admin2023",
    });
    const accessToken = authResponse.body.accessToken;

    const response = await request(app)
      .patch("/v1/banks/" + _id)
      .send(updateData)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toEqual(204);

    const bankService = new BankService(db);
    const result = bankService.read(response.body._id);
    expect(result.name).toEqual(updateData.name);
    expect(result.code).toEqual(updateData.code);
    expect(result.updatedAt instanceof Date).toBeTruthy();
    expect(result.updatedBy_id).toBe(authResponse.body._id);
  });
});
