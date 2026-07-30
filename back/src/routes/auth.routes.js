import { Router } from "express";
import { requireAuth, signToken } from "../middleware/auth.js";
import { findUserByEmail, toPublicUser, verifyPassword } from "../data/users.js";

export const authRouter = Router();

authRouter.post("/login", (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({
      error: "bad_request",
      message: "Both 'email' and 'password' are required.",
    });
  }

  const user = findUserByEmail(email);
  if (!user || !verifyPassword(user, password)) {
    return res.status(401).json({
      error: "invalid_credentials",
      message: "Email or password is incorrect.",
    });
  }

  res.json({ token: signToken(user), user: toPublicUser(user) });
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user, token: req.token });
});

// Tokens are stateless, so logout only tells the client to drop its copy.
authRouter.post("/logout", requireAuth, (req, res) => {
  res.json({ message: "Logged out. Discard the token on the client." });
});
