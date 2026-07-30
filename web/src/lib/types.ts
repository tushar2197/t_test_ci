export type Role = "admin" | "user";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type MeResponse = {
  user: User;
  token: { issuedAt?: number; expiresAt?: number };
};

export type HealthResponse = {
  status: string;
  uptimeSeconds: number;
  timestamp: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
};

export type Order = {
  id: string;
  total?: number;
  status: string;
  productId?: string;
  quantity?: number;
  ownerId?: number;
};

export type ApiErrorBody = {
  error?: string;
  message?: string;
};

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(status: number, body: ApiErrorBody | null) {
    super(body?.message ?? `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.code = body?.error;
  }
}
