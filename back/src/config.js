import "dotenv/config";

export const config = {
  port: Number(process.env.PORT ?? 3000),
  jwtSecret: process.env.JWT_SECRET ?? "dev-only-insecure-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
};

if (!process.env.JWT_SECRET) {
  console.warn(
    "[config] JWT_SECRET is not set, falling back to an insecure development secret."
  );
}
