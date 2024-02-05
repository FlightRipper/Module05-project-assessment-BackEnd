import express from 'express';
import Product from "../models/ProductModel.js"
import fs from "fs";

// Create a new product
const createProduct = async (req, res) => {
    console.log("Received request body:", req.body);
    try {
        const { Name, Price, Description, Category } = req.body;
        if (!Name || !Price || !Description || !Category) {
        return res.status(400).json({ error: "All fields are required" });
        }

        const images = req.files;
        if (!images || images.length === 0) {
        return res.status(400).json({ error: "At least one image is required" });
        }

        const imagePaths = images.map((image) => image.path);

        const newProduct = new Product({
        Name,
        Price,
        Description,
        Image: imagePaths, 
        Category,
        });

        const product = await newProduct.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

// Find all products function
const findAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("Category").exec();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

// Find Single Product function
const findProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id).populate("Category").exec();
        if (!product) {
        return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update specific product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const { Name, Price, Description } = req.body;
        if (!Name || !Price || !Description ) {
        return res.status(400).json({ error: "All fields are required" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { Name, Price, Description },
        { new: true }
        ).populate("Category").exec();

        if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

// Delete specific product function
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id).populate("Category").exec();
        if (!deletedProduct) {
        return res.status(404).json({ error: "Product not found" });
        }

        deletedProduct.Image.forEach((imagePath) => {
        fs.unlinkSync(imagePath);
        });

        res.status(200).json(deletedProduct);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteImage = async (req, res) => {
    try {
        const { id, index } = req.params;
        const product = await Product.findById(id);
        if (!product) {
        return res.status(404).json({ message: 'Product not found' });
        }
        const imageIndex = parseInt(index, 10);
        product.Image.splice(imageIndex, 1);
        await product.save();
        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const addImage = async (req, res) => {
    try {
        const { id } = req.params;
        const images = req.files;
        const product = await Product.findById(id);

        if (!product) {
        return res.status(404).json({ message: 'Product not found' });
        }

        if (!images || images.length === 0) {
        return res.status(400).json({ error: 'At least one image is required' });
        }

        const imagePaths = images.map((image) => image.path);
        
        product.Image.push(...imagePaths);

        await product.save();
        res.status(200).json({ message: 'Image added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export {
    createProduct,
    findAllProducts,
    findProduct,
    updateProduct,
    deleteProduct,
    deleteImage,
    addImage
};
