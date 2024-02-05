import express from "express"
const OrderRouter = express.Router();
import {createOrder, getOrderByUser} from "../Controllers/OrderController.js";


OrderRouter.post("/Order", createOrder);
OrderRouter.get("/Order/:id", getOrderByUser);

export default OrderRouter;