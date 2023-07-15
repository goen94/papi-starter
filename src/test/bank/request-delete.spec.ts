import request from "supertest";
import { bankData } from "./constant";
import { createApp } from "@src/app.js";

describe("request delete bank", () => {
  let _id = "";
  let _approverId = "";
  beforeEach(async () => {
    const app = await createApp();
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2023",
    });
    const accessToken = authResponse.body.accessToken;
    const response = await request(app).post("/v1/banks").send(bankData).set("Authorization", `Bearer ${accessToken}`);
    _id = response.body._id;

    const authApproverResponse = await request(app).post("/v1/auth/signin").send({
      username: "approver",
      password: "approver2023",
    });
    _approverId = authApproverResponse.body._id;
  });
  it("should check user is authorized", async () => {
    const app = await createApp();
    const response = await request(app).patch("/v1/banks/" + _id + "/request-delete");
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
      .post("/v1/banks/" + _id + "/request-delete")
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
      .post("/v1/banks/" + _id + "/request-delete")
      .send({})
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toEqual(422);
    expect(response.body.code).toBe(422);
    expect(response.body.status).toBe("Unprocessable Entity");
    expect(response.body.message).toBe(
      "The request was well-formed but was unable to be followed due to semantic errors."
    );
    expect(response.body.errors.approvalTo).toBe(["approvalTo is required"]);
    expect(response.body.errors.reasonDelete).toBe(["reasonDelete is required"]);
  });
  it("should request delete data", async () => {
    const app = await createApp();
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2023",
    });
    const accessToken = authResponse.body.accessToken;

    const requestDelete = {
      approvalTo: _approverId,
      reasonDelete: "this is reason",
    };
    const response = await request(app)
      .post("/v1/banks/" + _id + "/request-delete")
      .send(requestDelete)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toEqual(204);

    const bankService = new BankService(db);
    const result = bankService.read(_id);
    expect(result.requestApprovalDeleteTo_id).toBe(requestDelete.approvalTo);
    expect(result.requestApprovalDeleteReason).toBe(requestDelete.reasonDelete);
    expect(result.requestApprovalDeleteAt instanceof Date).toBeTruthy();
    expect(result.requestApprovalDeleteStatus).toBe("pending");
  });
});
