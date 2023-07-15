import request from "supertest";
import { bankData } from "./constant";
import { createApp } from "@src/app.js";

describe("list all banks", () => {
  it("should check user is authorized", async () => {
    const app = await createApp();
    const response = await request(app).get("/v1/banks");
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
    const response = await request(app).get("/v1/banks").set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(403);
    expect(response.body.code).toBe(403);
    expect(response.body.status).toBe("Forbidden");
    expect(response.body.message).toBe("Don't have necessary permissions for this resource.");
  });
  it("should read data from database", async () => {
    const app = await createApp();
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2023",
    });
    const accessToken = authResponse.body.accessToken;

    await request(app).post("/v1/banks").send(bankData).set("Authorization", `Bearer ${accessToken}`);

    const response = await request(app).get("/v1/banks").set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.data[0]._id).not.toBeNull();
    expect(response.body.data[0].code).toEqual(bankData.code);
    expect(response.body.data[0].name).toEqual(bankData.name);
    expect(response.body.data[0].address).toEqual(bankData.address);
    expect(response.body.data[0].phone).toEqual(bankData.phone);
    expect(response.body.data[0].fax).toEqual(bankData.fax);
    expect(response.body.data[0].notes).toEqual(bankData.notes);
    expect(response.body.data[0].createdAt instanceof Date).toBeTruthy();
    expect(response.body.data[0].createdBy_id).toBe(authResponse.body._id);

    expect(response.body.data[0].accounts[0].branch).toEqual(bankData.accounts[0].branch);
    expect(response.body.data[0].accounts[0].number).toEqual(bankData.accounts[0].number);
    expect(response.body.data[0].accounts[0].name).toEqual(bankData.accounts[0].name);
    expect(response.body.data[0].accounts[0].notes).toEqual(bankData.accounts[0].notes);
    expect(response.body.data[0].accounts[1].branch).toEqual(bankData.accounts[1].branch);
    expect(response.body.data[0].accounts[1].number).toEqual(bankData.accounts[1].number);
    expect(response.body.data[0].accounts[1].name).toEqual(bankData.accounts[1].name);
    expect(response.body.data[0].accounts[1].notes).toEqual(bankData.accounts[1].notes);

    expect(response.body.pagination.page).toEqual(1);
    expect(response.body.pagination.pageCount).toEqual(1);
    expect(response.body.pagination.pageSize).toEqual(10);
    expect(response.body.pagination.totalDocument).toEqual(1);
  });
});

describe("read bank", () => {
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
    const response = await request(app).get("/v1/banks/" + _id);
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
      .get("/v1/banks/" + _id)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(403);
    expect(response.body.code).toBe(403);
    expect(response.body.status).toBe("Forbidden");
    expect(response.body.message).toBe("Don't have necessary permissions for this resource.");
  });
  it("should read data from database", async () => {
    const app = await createApp();
    const authResponse = await request(app).post("/v1/auth/signin").send({
      username: "admin",
      password: "admin2023",
    });
    const accessToken = authResponse.body.accessToken;
    const response = await request(app)
      .get("/v1/banks/" + _id)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.data._id).not.toBeNull();
    expect(response.body.data.code).toEqual(bankData.code);
    expect(response.body.data.name).toEqual(bankData.name);
    expect(response.body.data.address).toEqual(bankData.address);
    expect(response.body.data.phone).toEqual(bankData.phone);
    expect(response.body.data.fax).toEqual(bankData.fax);
    expect(response.body.data.notes).toEqual(bankData.notes);
    expect(response.body.data.createdAt instanceof Date).toBeTruthy();
    expect(response.body.data.createdBy_id).toBe(authResponse.body._id);

    expect(response.body.data.accounts[0].branch).toEqual(bankData.accounts[0].branch);
    expect(response.body.data.accounts[0].number).toEqual(bankData.accounts[0].number);
    expect(response.body.data.accounts[0].name).toEqual(bankData.accounts[0].name);
    expect(response.body.data.accounts[0].notes).toEqual(bankData.accounts[0].notes);
    expect(response.body.data.accounts[1].branch).toEqual(bankData.accounts[1].branch);
    expect(response.body.data.accounts[1].number).toEqual(bankData.accounts[1].number);
    expect(response.body.data.accounts[1].name).toEqual(bankData.accounts[1].name);
    expect(response.body.data.accounts[1].notes).toEqual(bankData.accounts[1].notes);
  });
});
