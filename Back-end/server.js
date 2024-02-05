import express from "express";
import dotenv from "dotenv";
const app = express();
import cors from "cors";
import mongoose from "mongoose";
import AdminRouter from "./routes/AdminRoute.js";
import OrderRouter from "./routes/OrderRoute.js";
import ProductRouter from "./routes/ProductRoute.js";
import UserRouter from "./routes/UserRoute.js";
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use([UserRouter,ProductRouter,AdminRouter,OrderRouter])

app.use("/uploads", express.static('uploads'))

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error("MongoDB URI is not defined.");
    process.exit(1);
}
  
mongoose
.connect(mongoUri)
.then(() => {
    app.listen(process.env.PORT, () => {
    console.log("Server is running on port", process.env.PORT);
    });
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
});