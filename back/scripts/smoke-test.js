import { createApp } from "../src/app.js";

const server = createApp().listen(0);
await new Promise((resolve) => server.once("listening", resolve));
const base = `http://localhost:${server.address().port}`;

let failures = 0;

async function check(label, expectedStatus, path, options = {}) {
  const res = await fetch(`${base}${path}`, options);
  const body = await res.json().catch(() => null);
  const ok = res.status === expectedStatus;
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label} -> ${res.status} (expected ${expectedStatus})`);
  return body;
}

function authHeaders(token, extra = {}) {
  return { Authorization: `Bearer ${token}`, ...extra };
}

const json = { "Content-Type": "application/json" };

await check("public health", 200, "/api/public/health");
await check("protected profile without token", 401, "/api/protected/profile");
await check("login with wrong password", 401, "/api/auth/login", {
  method: "POST",
  headers: json,
  body: JSON.stringify({ email: "user@example.com", password: "nope" }),
});

const adminLogin = await check("login as admin", 200, "/api/auth/login", {
  method: "POST",
  headers: json,
  body: JSON.stringify({ email: "admin@example.com", password: "Passw0rd!" }),
});
const userLogin = await check("login as user", 200, "/api/auth/login", {
  method: "POST",
  headers: json,
  body: JSON.stringify({ email: "user@example.com", password: "Passw0rd!" }),
});

await check("me as user", 200, "/api/auth/me", { headers: authHeaders(userLogin.token) });
await check("protected profile as user", 200, "/api/protected/profile", {
  headers: authHeaders(userLogin.token),
});
await check("create order as user", 201, "/api/protected/orders", {
  method: "POST",
  headers: authHeaders(userLogin.token, json),
  body: JSON.stringify({ productId: "p-2", quantity: 2 }),
});
await check("admin route as user", 403, "/api/protected/admin/users", {
  headers: authHeaders(userLogin.token),
});
await check("admin route as admin", 200, "/api/protected/admin/users", {
  headers: authHeaders(adminLogin.token),
});
await check("malformed token", 401, "/api/auth/me", { headers: authHeaders("not-a-jwt") });
await check("unknown route", 404, "/api/nope");

server.close();
console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
