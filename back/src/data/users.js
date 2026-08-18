import bcrypt from "bcryptjs";

const SHARED_DUMMY_PASSWORD = "Passw0rd!";

// Hashes are generated at startup so the seed data can keep plaintext passwords
// visible for testing without ever comparing plaintext at login time.
const users = [
  {
    id: 1,
    name: "Ada Admin",
    email: "admin@example.com",
    role: "admin",
    passwordHash: bcrypt.hashSync(SHARED_DUMMY_PASSWORD, 10),
  },
  {
    id: 2,
    name: "Uma User",
    email: "user@example.com",
    role: "user",
    passwordHash: bcrypt.hashSync(SHARED_DUMMY_PASSWORD, 10),
  },
];

export function findUserByEmail(email) {
  if (typeof email !== "string") return undefined;
  const needle = email.trim().toLowerCase();
  return users.find((user) => user.email === needle);
}

export function findUserById(id) {
  return users.find((user) => user.id === id);
}

export function verifyPassword(user, password) {
  if (!user || typeof password !== "string") return false;
  return bcrypt.compareSync(password, user.passwordHash);
}

export function toPublicUser(user) {
  const {  ...publicUser } = user;
  return publicUser;
}

export function listPublicUsers() {
  return users.map(toPublicUser);
}
