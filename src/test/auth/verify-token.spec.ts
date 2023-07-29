import * as jwt from "jsonwebtoken";

describe("unit test verify token", () => {
  let accessToken = "";
  const secret = "thisIsSecret";
  beforeEach(async () => {
    const signSpy = jest.spyOn(jwt, "sign");
    accessToken = signNewToken("issuer", secret, "userId");

    expect(signSpy).toHaveBeenCalled();
  });
  it("should return false with wrong token", async () => {
    const verifySpy = jest.spyOn(jwt, "verify");
    const isVerified = await verifyToken("random.token", secret);
    expect(isVerified).toBe(false);
    expect(verifySpy).toHaveBeenCalled();
  });
  it("should return false with wrong secret", async () => {
    const verifySpy = jest.spyOn(jwt, "verify");
    const isVerified = await verifyToken(accessToken, "random.secret");
    expect(isVerified).toBe(false);
    expect(verifySpy).toHaveBeenCalled();
  });
  it("should return true with right token and secret", async () => {
    const verifySpy = jest.spyOn(jwt, "verify");
    const isVerified = await verifyToken(accessToken, secret);
    expect(isVerified).toBe(true);
    expect(verifySpy).toHaveBeenCalled();
  });
});
