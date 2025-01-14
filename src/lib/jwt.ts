/**
 * Validates a JWT token.
 *
 * @param token - The JWT token to validate.
 * @param clientId - The expected audience.
 * @param issuer - The expected issuer.
 * @param publicKeyEndpoint - The endpoint to fetch the JWKS.
 * @returns A promise that resolves to an object containing a boolean indicating whether the token is valid and an error message if invalid.
 *
 * The function performs the following checks:
 * - Splits the token into header, payload, and signature.
 * - Decodes and parses the header and payload.
 * - Verifies that the algorithm is RS256.
 * - Verifies that the audience matches the expected audience.
 * - Verifies that the issuer matches the expected issuer.
 * - Fetches and caches the JWKS from the public key endpoint.
 * - Finds the public key in the JWKS that matches the key ID in the token header.
 * - Imports the public key.
 * - Verifies the token signature using the public key.
 */
export async function validate(token: string, clientId: string, issuer: string, publicKeyEndpoint: string): Promise<{ isValid: boolean, error?: string }> {
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) {
    return { isValid: false, error: "Invalid token format." };
  }

  let decodedHeader, decodedPayload;
  try {
    decodedHeader = JSON.parse(Buffer.from(header, "base64").toString());
    decodedPayload = JSON.parse(Buffer.from(payload, "base64").toString());
  } catch (error) {
    return { isValid: false, error: `Error decoding token: ${error instanceof Error ? error.message : error}` };
  }

  // Verify the algorithm
  if (decodedHeader.alg !== "RS256") {
    return { isValid: false, error: `Invalid algorithm. Expected: RS256, got: ${decodedHeader.alg}.` };
  }

  // Verify the audience
  if (decodedPayload.aud !== clientId) {
    return { isValid: false, error: `Invalid audience. Expected: ${clientId}, got: ${decodedPayload.aud}.` };
  }

  // Verify the issuer
  if (decodedPayload.iss !== issuer) {
    return { isValid: false, error: `Invalid issuer. Expected: ${issuer}, got: ${decodedPayload.iss}.` };
  }

  // Verify the token is not expired
  const currentTime = Math.floor(Date.now() / 1000);
  if (decodedPayload.exp && currentTime > decodedPayload.exp) {
    return { isValid: false, error: "Token is expired." };
  }

  // Verify the token is not used before its "nbf" (not before) time
  if (decodedPayload.nbf && currentTime < decodedPayload.nbf) {
    return { isValid: false, error: "Token is not yet valid." };
  }

  // Verify the public key
  if (!publicKeyEndpoint) {
    return { isValid: false, error: "Public key endpoint is not defined." };
  }

  let jwks;
  try {
    // Fetch and cache the JWKS
    const jwksResponse = await fetch(publicKeyEndpoint, {
      headers: {
        "Cache-Control": "max-age=3600"
      }
    });
    jwks = await jwksResponse.json();
  } catch (error) {
    return { isValid: false, error: `Error fetching JWKS: ${error instanceof Error ? error.message : error}` };
  }

  const keyData = jwks.keys.find((key: { kid: string }) => key.kid === decodedHeader.kid);
  if (!keyData) {
    return { isValid: false, error: "Public key not found in JWKS endpoint." };
  }

  let key;
  try {
    // Import the public key
    key = await crypto.subtle.importKey(
      "jwk",
      keyData,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      true,
      ["verify"]
    );
  } catch (error) {
    return { isValid: false, error: `Error importing public key: ${error instanceof Error ? error.message : error}` };
  }


  let isValid;
  try {
    // Verify the signature
    const data = new TextEncoder().encode(`${header}.${payload}`);
    const signatureArrayBuffer = Buffer.from(signature, "base64");
    isValid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      key,
      signatureArrayBuffer,
      data
    );
  } catch (error) {
    return { isValid: false, error: `Error verifying signature: ${error instanceof Error ? error.message : error}` };
  }

  if (!isValid) {
    return { isValid: false, error: "Invalid signature. The token's signature does not match the expected value." };
  }

  return { isValid: true };
}
