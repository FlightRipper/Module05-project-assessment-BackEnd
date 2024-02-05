import express from "express";
import {
  createAdmin,
  findAllAdmins,
  updateAdminById,
  deleteAdminById,
  loginAdmin,
  getAdminbyId
} from "../Controllers/AdminController.js";

const AdminRouter = express.Router();

AdminRouter.post("/Admin", createAdmin);

AdminRouter.post("/Admin/login", loginAdmin);

AdminRouter.get("/Admin", findAllAdmins);

AdminRouter.get("/Admin/:id", getAdminbyId);

AdminRouter.put("/Admin/:id", updateAdminById);

AdminRouter.delete("/Admin/:id", deleteAdminById);

export default AdminRouter;
