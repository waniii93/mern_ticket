import express from "express";

import { login, createUser, getUsers } from "../controller/userController.js"

const userRoute = express.Router();

userRoute.post("/login", login)
userRoute.post("/add/user", createUser)
userRoute.get("/users", getUsers)

export default userRoute;