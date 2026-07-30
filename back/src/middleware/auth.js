import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { findUserById, toPublicUser } from "../data/users.js";

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

export function requireAuth(req, res, next) {
  const header = req.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return res.status(401).json({
      error: "unauthorized",
      message: "Missing Bearer token in Authorization header.",
    });
  }

  let payload;
  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch (err) {
    const expired = err.name === "TokenExpiredError";
    return res.status(401).json({
      error: expired ? "token_expired" : "invalid_token",
      message: expired ? "Token has expired." : "Token could not be verified.",
    });
  }

  const user = findUserById(payload.sub);
  if (!user) {
    return res.status(401).json({
      error: "unauthorized",
      message: "Token refers to a user that no longer exists.",
    });
  }

  req.user = toPublicUser(user);
  req.token = { issuedAt: payload.iat, expiresAt: payload.exp };
  next();
}

export function requireRole(...allowedRoles) {
  return function roleGuard(req, res, next) {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "unauthorized", message: "Authentication required." });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "forbidden",
        message: `Requires one of these roles: ${allowedRoles.join(", ")}.`,
      });
    }
    next();
  };
}
