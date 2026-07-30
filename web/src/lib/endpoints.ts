import { apiRequest } from "./api";
import type {
  HealthResponse,
  LoginResponse,
  MeResponse,
  Order,
  Product,
  User,
} from "./types";

export function login(email: string, password: string) {
  return apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function fetchMe(token: string) {
  return apiRequest<MeResponse>("/api/auth/me", { token });
}

export function logout(token: string) {
  return apiRequest<{ message: string }>("/api/auth/logout", {
    method: "POST",
    token,
  });
}

export function fetchHealth() {
  return apiRequest<HealthResponse>("/api/public/health");
}

export function fetchProducts() {
  return apiRequest<{ items: Product[] }>("/api/public/products");
}

export function fetchProfile(token: string) {
  return apiRequest<{
    user: User;
    preferences: { theme: string; region: string };
  }>("/api/protected/profile", { token });
}

export function fetchOrders(token: string) {
  return apiRequest<{ ownerId: number; orders: Order[] }>(
    "/api/protected/orders",
    { token }
  );
}

export function createOrder(
  token: string,
  productId: string,
  quantity: number
) {
  return apiRequest<{ order: Order }>("/api/protected/orders", {
    method: "POST",
    token,
    body: { productId, quantity },
  });
}

export function fetchAdminUsers(token: string) {
  return apiRequest<{ users: User[] }>("/api/protected/admin/users", {
    token,
  });
}
