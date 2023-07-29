import request from "supertest";
import setup from "../setup";
import teardown from "../teardown";
import { bankData } from "./constant";
import { createApp } from "@src/app.js";

describe("approve request delete bank", () => {
  let _id = "";
  let _approverId = "";
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

    const authApproverResponse = await request(app).post("/v1/auth/signin").send({
      username: "approver",
      password: "approver2023",
    });
    _approverId = authApproverResponse.body._id;
    const requestDelete = {
      approvalTo: _approverId,
      reasonDelete: "this is reason",
    };
    await request(app)
      .post("/v1/banks/" + _id + "/request-delete")
      .send(requestDelete)
      .set("Authorization", `Bearer ${accessToken}`);
  });
  afterEach(async () => {
    await teardown();
  });
  it("should check user is authorized", async () => {
    const app = await createApp();
    const response = await request(app).post("/v1/banks/" + _id + "/request-delete/approve");
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
      .post("/v1/banks/" + _id + "/request-delete/approve")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(403);
    expect(response.body.code).toBe(403);
    expect(response.body.status).toBe("Forbidden");
    expect(response.body.message).toBe("Don't have necessary permissions for this resource.");
  });
  it("should check user have permission to approve", async () => {
    const app = await createApp();
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2023",
    });
    const accessToken = authResponse.body.accessToken;
    const response = await request(app)
      .post("/v1/banks/" + _id + "/request-delete/approve")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(403);
    expect(response.body.code).toBe(403);
    expect(response.body.status).toBe("Forbidden");
    expect(response.body.message).toBe("Don't have necessary permissions for this resource.");
  });
  it("should check if request exist", async () => {
    const app = await createApp();
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "approver",
      password: "approver2023",
    });
    const accessToken = authResponse.body.accessToken;

    const response = await request(app)
      .post("/v1/banks/randomid/request-delete/approve")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toEqual(204);

    expect(response.statusCode).toEqual(404);
    expect(response.body.code).toBe(404);
    expect(response.body.status).toBe("Not Found");
    expect(response.body.message).toBe(
      "The URL is not recognized or endpoint is valid but the resource itself does not exist."
    );
  });
  it("should check if request in pending state", async () => {
    const app = await createApp();
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "approver",
      password: "approver2023",
    });
    const accessToken = authResponse.body.accessToken;

    const requestData = {
      reasonReject: "this is reason",
    };

    await request(app)
      .post("/v1/banks/" + _id + "/request-delete/reject")
      .send(requestData)
      .set("Authorization", `Bearer ${accessToken}`);

    const response = await request(app)
      .post("/v1/banks/" + _id + "/request-delete/approve")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body.code).toBe(404);
    expect(response.body.status).toBe("Not Found");
    expect(response.body.message).toBe(
      "The URL is not recognized or endpoint is valid but the resource itself does not exist."
    );
  });
  it("should approve delete request", async () => {
    const app = await createApp();
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "approver",
      password: "approver2023",
    });
    const accessToken = authResponse.body.accessToken;

    const response = await request(app)
      .post("/v1/banks/" + _id + "/request-delete/approve")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.statusCode).toEqual(204);

    const bankService = new BankService(db);
    const result = bankService.read(_id);
    expect(result.requestApprovalDeleteReasonReject).toBe(null);
    expect(result.requestApprovalDeleteStatus).toBe("approved");
  });
});
