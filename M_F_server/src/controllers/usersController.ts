import { Request, Response } from "express";
import {
  createUser,
  getUserById,
  getUsers,
  updateUserLastActive,
} from "../models/usersModel";

export async function listUsers(_req: Request, res: Response) {
  const users = await getUsers();
  res.json(users);
}

export async function getUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  const user = await getUserById(id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(user);
}

export async function createUserHandler(req: Request, res: Response) {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const id = await createUser({ name, email, password, role: role || "USER" });
  res.status(201).json({ id, message: "User created" });
}

export async function touchUserLastActive(req: Request, res: Response) {
  const id = Number(req.params.id);
  const user = await getUserById(id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  await updateUserLastActive(id);
  res.json({ message: "Last active updated" });
}
