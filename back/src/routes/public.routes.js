import { Router } from "express";

export const publicRouter = Router();

publicRouter.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

publicRouter.get("/info", (req, res) => {
  res.json({
    service: "testing-aws-auth",
    environment: process.env.NODE_ENV ?? "development",
    node: process.version,
  });
});

publicRouter.get("/products", (req, res) => {
  res.json({
    items: [
      { id: "p-1", name: "Starter Plan", price: 0 },
      { id: "p-2", name: "Pro Plan", price: 29 },
      { id: "p-3", name: "Enterprise Plan", price: 99 },
    ],
  });
});
