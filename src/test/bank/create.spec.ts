import request from "supertest";
import setup from "../setup";
import teardown from "../teardown";
import { bankData } from "./constant";
import { createApp } from "@src/app.js";
import { db } from "@src/database/database.js";

describe("create bank", () => {
  beforeEach(async () => {
    await setup();
  });
  afterEach(async () => {
    await teardown();
  });
  it("should check user is authorized", async () => {
    const app = await createApp();
    const response = await request(app).post("/v1/banks").send({});
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
    const response = await request(app).post("/v1/banks").send({}).set("Authorization", `Bearer ${accessToken}`);

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

    const response = await request(app).post("/v1/banks").send({}).set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toEqual(422);
    expect(response.body.code).toBe(422);
    expect(response.body.status).toBe("Unprocessable Entity");
    expect(response.body.message).toBe(
      "The request was well-formed but was unable to be followed due to semantic errors."
    );
    expect(response.body.errors.code).toBe(["code is exists"]);
    expect(response.body.errors.name).toBe(["name is required"]);
  });
  it("should check unique fields", async () => {
    const app = await createApp();
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2023",
    });
    const accessToken = authResponse.body.accessToken;

    await request(app).post("/v1/banks").send(bankData).set("Authorization", `Bearer ${accessToken}`);
    const response = await request(app).post("/v1/banks").send(bankData).set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(422);
    expect(response.body.code).toBe(422);
    expect(response.body.message).toBe("Unprocessable Entity");
    expect(response.body.message).toBe(
      "The request was well-formed but was unable to be followed due to semantic errors."
    );
    expect(response.body.errors.code).toBe(["code is exists"]);
    expect(response.body.errors.name).toBe(["name is exists"]);
  });
  it("should save to database", async () => {
    const app = await createApp();
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2023",
    });
    const accessToken = authResponse.body.accessToken;

    const response = await request(app).post("/v1/banks").send(bankData).set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toEqual(201);
    expect(response.body._id).not.toBeNull();

    const bankService = new BankService(db);
    const result = bankService.read(response.body._id);
    expect(result.code).toEqual(bankData.code);
    expect(result.name).toEqual(bankData.name);
    expect(result.address).toEqual(bankData.address);
    expect(result.phone).toEqual(bankData.phone);
    expect(result.fax).toEqual(bankData.fax);
    expect(result.notes).toEqual(bankData.notes);
    expect(result.createdAt instanceof Date).toBeTruthy();
    expect(result.createdBy_id).toBe(authResponse.body._id);

    expect(result.accounts[0].branch).toEqual(bankData.accounts[0].branch);
    expect(result.accounts[0].number).toEqual(bankData.accounts[0].number);
    expect(result.accounts[0].name).toEqual(bankData.accounts[0].name);
    expect(result.accounts[0].notes).toEqual(bankData.accounts[0].notes);
    expect(result.accounts[1].branch).toEqual(bankData.accounts[1].branch);
    expect(result.accounts[1].number).toEqual(bankData.accounts[1].number);
    expect(result.accounts[1].name).toEqual(bankData.accounts[1].name);
    expect(result.accounts[1].notes).toEqual(bankData.accounts[1].notes);
  });
});
