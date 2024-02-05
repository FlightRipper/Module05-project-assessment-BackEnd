import express from "express"
const ProductRouter = express.Router();
import upload from "../middleware/multer.js";
import {createProduct,
    findAllProducts,
    findProduct,
    updateProduct,
    deleteProduct,
    deleteImage,
    addImage
} from "../Controllers/ProductController.js";


ProductRouter.post("/Product",upload.array("Image"),createProduct);
ProductRouter.get("/Product", findAllProducts);
ProductRouter.get("/Product/:id", findProduct);
ProductRouter.delete("/Product/:id", deleteProduct);
ProductRouter.patch("/Product/:id", updateProduct);
ProductRouter.delete("/Product/:id/:index", deleteImage);
ProductRouter.post("/Product/:id", upload.array("Image"), addImage);


export default ProductRouter;