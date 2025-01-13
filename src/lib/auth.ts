import { headers } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

type User = {
  firstName: string;
  lastName: string;
  email: string;
};


// aud = AZURE_APP_CLIENT_SECRET
// iss = AZURE_OPENID_CONFIG_ISSUER
// oid = AZURE_APP_CLIENT_ID

const loginEndpoint = '/oauth2/login';

export async function validateToken(token: string): Promise<boolean> {
  try {
    const secret = process.env.AZURE_APP_CLIENT_SECRET;
    if (!secret) {
      throw new Error("AZURE_APP_CLIENT_SECRET is not defined");
    }
    jwt.verify(token, secret);
    return true;
  } catch (error) {
    console.error("Invalid token", error);
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
  const isValid = await validateToken(token);
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
