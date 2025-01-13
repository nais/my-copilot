import { headers } from "next/headers";
import { redirect } from "next/navigation";

type User = {
  firstName: string;
  lastName: string;
  email: string;
};

// aud = AZURE_APP_CLIENT_SECRET
// iss = AZURE_OPENID_CONFIG_ISSUER
// oid = AZURE_APP_CLIENT_ID

const loginEndpoint = '/oauth2/login';

const publicKeys = process.env.AZURE_APP_JWKS;
if (!publicKeys && process.env.NODE_ENV !== "development") {
  throw new Error("Public key is not defined in environment variables");
}

export async function validateJsonWebToken(token: string): Promise<boolean> {
  try {
    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) {
      throw new Error("Invalid token format");
    }

    const decodedHeader = JSON.parse(Buffer.from(header, "base64").toString());
    const decodedPayload = JSON.parse(Buffer.from(payload, "base64").toString());

    console.log("decodedHeader", decodedHeader);
    console.log("decodedPayload", decodedPayload);

    // Verify the algorithm
    if (decodedHeader.alg !== "RS256") {
      throw new Error(`Invalid algorithm. Expected: RS256, got: ${decodedHeader.alg}`);
    }

    // Verify the audience
    if (decodedPayload.aud !== process.env.AZURE_APP_CLIENT_ID) {
      throw new Error(`Invalid audience. Expected: ${process.env.AZURE_APP_CLIENT_SECRET}, got: ${decodedPayload.aud}`);
    }

    // Verify the issuer
    if (decodedPayload.iss !== process.env.AZURE_OPENID_CONFIG_ISSUER) {
      throw new Error(`Invalid issuer. Expected: ${process.env.AZURE_OPENID_CONFIG_ISSUER}, got: ${decodedPayload.iss}`);
    }

    // Verify the public key
    if (!publicKeys) {
      throw new Error(`Public key is not defined in environment variables`);
    }

    // Verify the signature using Web Crypto API
    const data = `${header}.${payload}`;
    const keysData = JSON.parse(publicKeys);

    if (!Array.isArray(keysData.keys) || keysData.keys.length === 0) {
      throw new Error("Invalid JWK format. Expected: keys array with at least one key");
    }

    const keyData = keysData.keys[0];
    if (!keyData.kty || !keyData.n || !keyData.e) {
      throw new Error(`Invalid JWK format. Expected: kty, n, e properties, got: ${JSON.stringify(keyData)}`);
    }
    const key = await crypto.subtle.importKey(
      "jwk",
      keyData,
      { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } },
      true,
      ["verify"]
    );
    const isValid = await crypto.subtle.verify(
      { name: "RSASSA-PKCS1-v1_5" },
      key,
      Buffer.from(signature, "base64"),
      Buffer.from(data)
    );

    if (!isValid) {
      throw new Error("Invalid signature");
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error("JWT validation error:", error.message, error.stack);
    } else {
      console.error("JWT validation error:", error);
    }
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser(false);
  return user !== null;
}

export async function getUser(shouldRedirect: boolean = true): Promise<User | null> {
  if (process.env.NODE_ENV === "development") {
    return {
      firstName: "Ola Kari",
      lastName: "Nordmann",
      email: "dev@localhost",
    };
  }

  const authHeader = (await headers()).get("Authorization");
  if (!authHeader) {
    if (shouldRedirect) {
      redirect(loginEndpoint);
    }
    return null;
  }

  const token = authHeader.replace("Bearer ", "");
  const isValid = await validateJsonWebToken(token);
  if (!isValid) {
    if (shouldRedirect) {
      redirect(loginEndpoint);
    }
    return null;
  }

  const jwtPayload = token.split(".")[1];
  const payload = JSON.parse(Buffer.from(jwtPayload, "base64").toString());

  const [lastName, firstName] = payload.name.split(", ");
  const email = payload.preferred_username.toLowerCase();

  return {
    firstName,
    lastName,
    email,
  };
}
