import { ApiError } from "@point-hub/express-error-handler";
import * as hashUtils from "@src/utils/hash.js";
import request from "supertest";
import setup from "../setup";
import teardown from "../teardown";
import { createApp } from "@src/app.js";
import { QueryInterface } from "@src/database/connection";
import { db } from "@src/database/database";

describe("e2e signin", () => {
  beforeEach(async () => {
    await setup();
  });
  it("should check user is authorized", async () => {
    const app = await createApp();
    const response = await request(app).post("/v1/auth/signin").send({
      username: "user",
      password: "user2024",
    });
    expect(response.statusCode).toEqual(401);
    expect(response.body.code).toBe(401);
    expect(response.body.status).toBe("Unauthorized");
    expect(response.body.message).toBe("Authentication credentials is invalid.");
  });
  it("should return user data and access token", async () => {
    const app = await createApp();
    const response = await request(app).post("/v1/auth/signin").send({
      username: "user",
      password: "user2023",
    });

    const query: QueryInterface = {
      fields: "",
      filter: { username: "user" },
      page: 1,
      pageSize: 1,
      sort: "",
    };

    const userRepository = new UserRepository(db);
    const user = (await userRepository.readMany(query)) as any;

    expect(response.body.accessToken).not.toBeNull();
    expect(response.body.name).toEqual(user.name);
    expect(response.body.email).toEqual(user.email);
    expect(response.body.username).toEqual(user.username);
    expect(response.body.password).toBeNull();
  });
});

describe("unit test signin", () => {
  let user;
  const username = "user";
  beforeEach(async () => {
    await setup();
    const query: QueryInterface = {
      fields: "",
      filter: { username },
      page: 1,
      pageSize: 1,
      sort: "",
    };

    const userRepository = new UserRepository(db);
    user = (await userRepository.readMany(query)) as any;
  });
  afterEach(async () => {
    await teardown();
  });
  it("should throw ApiError with wrong password", async () => {
    const verifySpy = jest.spyOn(hashUtils, "verify");
    try {
      const signinUserService = new SigninUserService(db);

      await signinUserService.handle(username, "user2024");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
    }

    expect(verifySpy).toHaveBeenCalledWith("user2024", user.password);
  });
  it("should return user data and access token with right password", async () => {
    const verifySpy = jest.spyOn(hashUtils, "verify");
    const signinUserService = new SigninUserService(db);

    const result = await signinUserService.handle(username, "user2023");

    expect(verifySpy).toHaveBeenCalledWith("user2024", user.password);
    expect(result.accessToken).not.toBeNull();
    expect(result.name).toEqual(user.name);
    expect(result.email).toEqual(user.email);
    expect(result.username).toEqual(user.username);
    expect(result.password).toBeNull();
  });
});
