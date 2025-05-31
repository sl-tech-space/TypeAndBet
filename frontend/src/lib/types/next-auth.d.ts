import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    gold?: number;
    icon?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }

  interface Session extends DefaultSession {
    user: {
      id?: string;
      name?: string;
      email?: string;
      gold?: number;
      icon?: string;
    };
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: "RefreshAccessTokenError";
  }

  interface JWT {
    id?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
  }
}
