import { validate } from "./jwt";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

function createToken(header: object, payload: object, signature: string = "signature"): string {
  const encode = (obj: object) => Buffer.from(JSON.stringify(obj)).toString("base64url");
  return `${encode(header)}.${encode(payload)}.${signature}`;
}

describe("validate", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should return invalid for a token with invalid format", async () => {
    const result = await validate("invalid.token", "clientId", "issuer", "publicKeyEndpoint");
    expect(result).toEqual({ isValid: false, error: "Invalid token format." });
  });

  it("should return invalid for a token with invalid json", async () => {
    const result = await validate("invalid.token.invalid", "clientId", "issuer", "publicKeyEndpoint");
    expect(result.isValid).toBe(false);
    expect(result.error).toMatch(/^Error decoding token: Unexpected token .* is not valid JSON/);
  });

  it("should return invalid for a token with wrong algorithm", async () => {
    const token = createToken({ alg: "HS256" }, { aud: "clientId", iss: "issuer" });
    const result = await validate(token, "clientId", "issuer", "publicKeyEndpoint");
    expect(result).toEqual({ isValid: false, error: "Invalid algorithm. Expected: RS256, got: HS256." });
  });

  it("should return invalid for a token with wrong audience", async () => {
    const token = createToken({ alg: "RS256" }, { aud: "clientId", iss: "issuer" });
    const result = await validate(token, "wrongClientId", "issuer", "publicKeyEndpoint");
    expect(result).toEqual({ isValid: false, error: "Invalid audience. Expected: wrongClientId, got: clientId." });
  });

  it("should return invalid for a token with wrong issuer", async () => {
    const token = createToken({ alg: "RS256" }, { aud: "clientId", iss: "wrongIssuer" });
    const result = await validate(token, "clientId", "issuer", "publicKeyEndpoint");
    expect(result).toEqual({ isValid: false, error: "Invalid issuer. Expected: issuer, got: wrongIssuer." });
  });

  it("should return invalid if token is expired", async () => {
    const token = createToken(
      { alg: "RS256" },
      { aud: "clientId", iss: "issuer", exp: Math.floor(Date.now() / 1000) - 10 }
    );
    const result = await validate(token, "clientId", "issuer", "publicKeyEndpoint");
    expect(result).toEqual({ isValid: false, error: "Token is expired." });
  });

  it("should return invalid if token is not yet valid", async () => {
    const token = createToken(
      { alg: "RS256" },
      { aud: "clientId", iss: "issuer", nbf: Math.floor(Date.now() / 1000) + 10 }
    );
    const result = await validate(token, "clientId", "issuer", "publicKeyEndpoint");
    expect(result).toEqual({ isValid: false, error: "Token is not yet valid." });
  });

  it("should return invalid if public key endpoint is not defined", async () => {
    const token = createToken({ alg: "RS256" }, { aud: "clientId", iss: "issuer" });
    const result = await validate(token, "clientId", "issuer", "");
    expect(result).toEqual({ isValid: false, error: "Public key endpoint is not defined." });
  });

  it("should return invalid if public key is not found in JWKS", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ keys: [] }));
    const token = createToken({ alg: "RS256", kid: "123" }, { aud: "clientId", iss: "issuer" });
    const result = await validate(token, "clientId", "issuer", "publicKeyEndpoint");
    expect(result).toEqual({ isValid: false, error: "Public key not found in JWKS endpoint." });
  });

  it("should return invalid if there is an error fetching JWKS", async () => {
    fetchMock.mockRejectOnce(new Error("Network error"));
    const token = createToken({ alg: "RS256", kid: "123" }, { aud: "clientId", iss: "issuer" });
    const result = await validate(token, "clientId", "issuer", "publicKeyEndpoint");
    expect(result).toEqual({ isValid: false, error: "Error fetching JWKS: Network error" });
  });

  it("should return invalid if there is an error importing public key", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ keys: [{ kid: "123", kty: "RSA", alg: "RS256", use: "sig", n: "abc", e: "AQAB" }] })
    );
    const token = createToken({ alg: "RS256", kid: "123" }, { aud: "clientId", iss: "issuer" });
    jest.spyOn(crypto.subtle, "importKey").mockImplementationOnce(() => {
      throw new Error("Import error");
    });
    const result = await validate(token, "clientId", "issuer", "publicKeyEndpoint");
    expect(result).toEqual({ isValid: false, error: "Error importing public key: Import error" });
  });

  it("should return invalid if there is an error verifying signature", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ keys: [{ kid: "123", kty: "RSA", alg: "RS256", use: "sig", n: "abc", e: "AQAB" }] })
    );
    const token = createToken({ alg: "RS256", kid: "123" }, { aud: "clientId", iss: "issuer" });
    jest.spyOn(crypto.subtle, "verify").mockImplementationOnce(() => {
      throw new Error("Verify error");
    });
    const result = await validate(token, "clientId", "issuer", "publicKeyEndpoint");
    expect(result).toEqual({ isValid: false, error: "Error verifying signature: Verify error" });
  });

  it("should return invalid if signature does not match", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ keys: [{ kid: "123", kty: "RSA", alg: "RS256", use: "sig", n: "abc", e: "AQAB" }] })
    );
    const token = createToken({ alg: "RS256", kid: "123" }, { aud: "clientId", iss: "issuer" });
    jest.spyOn(crypto.subtle, "verify").mockResolvedValueOnce(false);
    const result = await validate(token, "clientId", "issuer", "publicKeyEndpoint");
    expect(result).toEqual({
      isValid: false,
      error: "Invalid signature. The token's signature does not match the expected value.",
    });
  });

  it("should return valid for a correct token", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ keys: [{ kid: "123", kty: "RSA", alg: "RS256", use: "sig", n: "abc", e: "AQAB" }] })
    );
    const token = createToken(
      { alg: "RS256", kid: "123" },
      {
        aud: "clientId",
        iss: "issuer",
        nbf: Math.floor(Date.now() / 1000) - 10, // Token is valid 10 seconds ago
        exp: Math.floor(Date.now() / 1000) + 3600, // Token expires in 1 hour
      }
    );
    jest.spyOn(crypto.subtle, "verify").mockResolvedValueOnce(true);
    const { isValid, error, payload } = await validate(token, "clientId", "issuer", "publicKeyEndpoint");
    expect(isValid).toEqual(true);
    expect(error).toBeUndefined();
    expect(payload).toEqual({ aud: "clientId", iss: "issuer", nbf: expect.any(Number), exp: expect.any(Number) });
  });
});
