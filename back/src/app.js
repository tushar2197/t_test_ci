import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes.js";
import { publicRouter } from "./routes/public.routes.js";
import { protectedRouter } from "./routes/protected.routes.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({
      service: "testing-aws-auth",
      routes: {
        public: ["GET /api/public/health", "GET /api/public/info", "GET /api/public/products"],
        auth: ["POST /api/auth/login", "GET /api/auth/me", "POST /api/auth/logout"],
        protected: [
          "GET /api/protected/profile",
          "GET /api/protected/orders",
          "POST /api/protected/orders",
          "GET /api/protected/admin/users (admin)",
          "DELETE /api/protected/admin/users/:id (admin)",
        ],
      },
    });
  });

  app.use("/api/public", publicRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/protected", protectedRouter);

  app.use((req, res) => {
    res.status(404).json({ error: "not_found", message: `No route for ${req.method} ${req.originalUrl}.` });
  });

  app.use((err, req, res) => {
    console.error("[error]", err);
    res.status(err.status ?? 500).json({
      error: "internal_error",
      message: err.expose ? err.message : "Something went wrong.",
    });
  });

  return app;
}
