import request from "supertest";
import { bankData } from "./constant";
import { createApp } from "@src/app.js";

describe("archive bank", () => {
  let _id = "";
  beforeEach(async () => {
    const app = await createApp();
    const authResponse = await request(app).patch("/v1/auth/signin").send({
      username: "admin",
      password: "admin2023",
    });
    const accessToken = authResponse.body.accessToken;
    const response = await request(app).post("/v1/banks").send(bankData).set("Authorization", `Bearer ${accessToken}`);
    _id = response.body._id;
  });
  it("should check user is authorized", async () => {
    const app = await createApp();
    const response = await request(app).post("/v1/banks/" + _id + "/archive");
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
      .post("/v1/banks/" + _id + "/archive")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(403);
    expect(response.body.code).toBe(403);
    expect(response.body.status).toBe("Forbidden");
    expect(response.body.message).toBe("Don't have necessary permissions for this resource.");
  });
  it("should archive data", async () => {
    const app = await createApp();
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2023",
    });
    const accessToken = authResponse.body.accessToken;
    const responseArchive = await request(app)
      .post("/v1/banks/" + _id + "/archive")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(responseArchive.statusCode).toEqual(204);

    const bankService = new BankService(db);
    const result = bankService.read(_id);
    expect(result.isArchived).toBe(true);
  });
});
