import request from "supertest";
import setup from "../setup";
import teardown from "../teardown";
import { bankData } from "./constant";
import { createApp } from "@src/app.js";

describe("delete bank", () => {
  let _id = "";
  beforeEach(async () => {
    await setup();
    const app = await createApp();
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2023",
    });
    const accessToken = authResponse.body.accessToken;
    const response = await request(app).post("/v1/banks").send(bankData).set("Authorization", `Bearer ${accessToken}`);
    _id = response.body._id;
  });
  afterEach(async () => {
    await teardown();
  });
  it("should check user is authorized", async () => {
    const app = await createApp();
    const response = await request(app).delete("/v1/banks/" + _id);
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
      .delete("/v1/banks/" + _id)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(403);
    expect(response.body.code).toEqual(403);
    expect(response.body.status).toEqual("Forbidden");
    expect(response.body.message).toBe("Don't have necessary permissions for this resource");
  });
  it("should delete data from database", async () => {
    const app = await createApp();
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2023",
    });
    const accessToken = authResponse.body.accessToken;
    const responseDelete = await request(app)
      .delete("/v1/banks/" + _id)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(responseDelete.statusCode).toEqual(204);

    const response = await request(app).get("/v1/banks").set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.data.length).toBe(0);

    expect(response.body.pagination.page).toEqual(1);
    expect(response.body.pagination.pageCount).toEqual(0);
    expect(response.body.pagination.pageSize).toEqual(10);
    expect(response.body.pagination.totalDocument).toEqual(0);
  });
});
