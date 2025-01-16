import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { validate } from "./jwt";

const loginEndpoint = "/oauth2/login";

type User = {
  firstName: string;
  lastName: string;
  email: string;
  groups: string[];
};

export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser(false);
  return user !== null;
}

export async function getUser(shouldRedirect: boolean = true): Promise<User | null> {
  if (process.env.NODE_ENV === "development") {
    return {
      firstName: "Hans Kristian",
      lastName: "Flaatten",
      email: "hans.kristian.flaatten@nav.no",
      groups: ["group1", "group2"],
    };
  }

  const requiredEnvVars = ["AZURE_APP_CLIENT_ID", "AZURE_OPENID_CONFIG_JWKS_URI", "AZURE_OPENID_CONFIG_ISSUER"];

  requiredEnvVars.forEach((name) => {
    if (!process.env[name]) {
      throw new Error(`Environment variable ${name} is not defined.`);
    }
  });

  const AZURE_APP_CLIENT_ID = process.env.AZURE_APP_CLIENT_ID!;
  const AZURE_OPENID_CONFIG_JWKS_URI = process.env.AZURE_OPENID_CONFIG_JWKS_URI!;
  const AZURE_OPENID_CONFIG_ISSUER = process.env.AZURE_OPENID_CONFIG_ISSUER!;

  const authHeader = (await headers()).get("Authorization");
  if (!authHeader) {
    if (shouldRedirect) {
      redirect(loginEndpoint);
    }
    return null;
  }

  const token = authHeader.replace("Bearer ", "");
  const { isValid, payload, error } = await validate(token, AZURE_APP_CLIENT_ID, AZURE_OPENID_CONFIG_ISSUER, AZURE_OPENID_CONFIG_JWKS_URI);
  if (!isValid || !payload) {
    console.error("Authorization token validation failed:", error);
    if (shouldRedirect) {
      redirect(loginEndpoint);
    }
    return null;
  }

  const [lastName, firstName] = payload.name ? payload.name.split(", ") : ["", ""];
  const email = (payload.preferred_username ?? "").toLowerCase();
  const groups = payload.groups ?? [];

  return {
    firstName,
    lastName,
    email,
    groups,
  };
}
