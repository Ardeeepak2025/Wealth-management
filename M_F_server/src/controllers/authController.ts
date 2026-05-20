import { Request, Response } from "express";
import {
  getUserByEmail,
  getUserById,
  updateUserLastActive,
  createUser,
} from "../models/usersModel";
import {
  createToken,
  revokeToken,
  verifyToken,
} from "../models/authModel";

function getAuthToken(req: Request): string | null {
  const authHeader = req.header("authorization") || req.header("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  const bodyToken = req.body?.token;
  return typeof bodyToken === "string" && bodyToken.trim() ? bodyToken.trim() : null;
}

function sanitizeUser(user: Awaited<ReturnType<typeof getUserById>>) {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "email and password are required" });
    return;
  }

  const user = await getUserByEmail(String(email));
  if (!user || user.password !== String(password)) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const tokenDetails = createToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  await updateUserLastActive(user.id);

  res.json({
    message: "Login successful",
    token: tokenDetails.token,
    expiresAt: tokenDetails.expiresAt,
    user: sanitizeUser(user),
  });
}

export async function logout(req: Request, res: Response) {
  const token = getAuthToken(req);
  if (!token) {
    res.status(400).json({ message: "Missing auth token" });
    return;
  }

  const removed = revokeToken(token);
  if (!removed) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  res.json({ message: "Logout successful" });
}

export async function currentUser(req: Request, res: Response) {
  const token = getAuthToken(req);
  if (!token) {
    res.status(401).json({ message: "Missing auth token" });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  const user = await getUserById(payload.userId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json({
    user: sanitizeUser(user),
    token: {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      expiresAt:
        typeof payload.exp === "number"
          ? new Date(payload.exp * 1000).toISOString()
          : null,
    },
  });
}

export async function register(req: Request, res: Response) {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ message: "name, email and password are required" });
    return;
  }

  const existing = await getUserByEmail(String(email));
  if (existing) {
    res.status(409).json({ message: "Email already registered" });
    return;
  }

  const id = await createUser({ name, email, password, role: role || "USER" });
  const user = await getUserById(id);
  if (!user) {
    res.status(500).json({ message: "Failed to create user" });
    return;
  }

  const tokenDetails = createToken({ userId: user.id, email: user.email, role: user.role });
  await updateUserLastActive(user.id).catch(() => {});

  res.status(201).json({ message: "User registered", token: tokenDetails.token, expiresAt: tokenDetails.expiresAt, user: sanitizeUser(user) });
}