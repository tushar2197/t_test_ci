import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { listPublicUsers } from "../data/users.js";

export const protectedRouter = Router();

protectedRouter.use(requireAuth);

protectedRouter.get("/profile", (req, res) => {
  res.json({
    user: req.user,
    preferences: { theme: "dark", region: "ap-south-1" },
  });
});

protectedRouter.get("/orders", (req, res) => {
  res.json({
    ownerId: req.user.id,
    orders: [
      { id: "o-1001", total: 29, status: "paid" },
      { id: "o-1002", total: 99, status: "pending" },
    ],
  });
});

protectedRouter.post("/orders", (req, res) => {
  const { productId, quantity = 1 } = req.body ?? {};
  if (!productId) {
    return res
      .status(400)
      .json({ error: "bad_request", message: "'productId' is required." });
  }
  res.status(201).json({
    order: {
      id: `o-${Math.floor(Math.random() * 9000) + 1000}`,
      productId,
      quantity,
      ownerId: req.user.id,
      status: "created",
    },
  });
});

protectedRouter.get("/admin/users", requireRole("admin"), (req, res) => {
  res.json({ users: listPublicUsers() });
});

protectedRouter.delete("/admin/users/:id", requireRole("admin"), (req, res) => {
  res.json({
    message: `Pretended to delete user ${req.params.id}. Dummy data is never mutated.`,
  });
});
