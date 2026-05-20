"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.getUser = getUser;
exports.createUserHandler = createUserHandler;
exports.touchUserLastActive = touchUserLastActive;
const usersModel_1 = require("../models/usersModel");
async function listUsers(_req, res) {
    const users = await (0, usersModel_1.getUsers)();
    res.json(users);
}
async function getUser(req, res) {
    const id = Number(req.params.id);
    const user = await (0, usersModel_1.getUserById)(id);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(user);
}
async function createUserHandler(req, res) {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    const id = await (0, usersModel_1.createUser)({ name, email, password, role: role || "USER" });
    res.status(201).json({ id, message: "User created" });
}
async function touchUserLastActive(req, res) {
    const id = Number(req.params.id);
    const user = await (0, usersModel_1.getUserById)(id);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    await (0, usersModel_1.updateUserLastActive)(id);
    res.json({ message: "Last active updated" });
}
