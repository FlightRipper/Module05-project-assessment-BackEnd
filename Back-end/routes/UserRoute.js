import express from "express";
import {
    createUser,
    findAllUsers,
    updateUserById,
    deleteUserById,
    loginUser,
    getUserById,
} from "../Controllers/UserController.js";

const UserRouter = express.Router();

UserRouter.post("/Admin", createUser);

UserRouter.post("/Admin/login", loginUser);

UserRouter.get("/Admin", findAllUsers);

UserRouter.get("/Admin/:id", getUserById);

UserRouter.put("/Admin/:id", updateUserById);

UserRouter.delete("/Admin/:id", deleteUserById);

export default UserRouter;
