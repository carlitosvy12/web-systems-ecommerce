import { apiRequest } from "./client";

export type UserPublic = {
  id: number;
  email: string;
  is_admin: boolean;
  created_at: string;
};

export async function register(email: string, password: string) {
  return apiRequest<UserPublic>({
    method: "POST",
    path: "/auth/register",
    body: { email, password }
  });
}

export type LoginResponse = {
  access_token: string;
  token_type: "bearer";
};

export async function login(email: string, password: string) {
  return apiRequest<LoginResponse>({
    method: "POST",
    path: "/auth/login",
    body: { email, password }
  });
}

export async function me() {
  return apiRequest<UserPublic>({
    method: "GET",
    path: "/auth/me",
    auth: true
  });
}
