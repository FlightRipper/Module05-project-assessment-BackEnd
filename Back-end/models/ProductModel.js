import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
    title: { type: String, required: true },
    images: [{ type: String }],
    price: { type: Number, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const ProductModel = mongoose.model('Product', productSchema);
export default ProductModel