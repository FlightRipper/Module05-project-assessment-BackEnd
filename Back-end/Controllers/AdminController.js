import express from 'express';
import bcrypt from "bcrypt";
import Admin from "../models/AdminModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.SECRET;

// Create JWT token upon signing in
const createToken = (id) => {
 return jwt.sign({ id }, secret, { expiresIn: '3d' });
};

// Create a new admin
const createAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
        }

        const existingAdmin = await Admin.findOne({ username });

        if (existingAdmin) {
        return res.status(400).json({ error: 'Admin with this username already exists' });
        }

        const newAdmin = new Admin({ username, password });
        const savedAdmin = await newAdmin.save();
        res.status(200).json(savedAdmin);
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

// Login function for admins
const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
        }

        const existingAdmin = await Admin.findOne({ username });
        if (!existingAdmin) {
        return res.status(400).json({ error: 'Admin not found' });
        }

        const match = await bcrypt.compare(password, existingAdmin.password);
        if (!match) {
        return res.status(400).json({ error: 'Incorrect password' });
        }

        const token = createToken(existingAdmin._id);
        return res.status(200).json({ username, token });
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

// Get All admins
const findAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

// Get Specific admin
const getAdminbyId = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
        res.status(404).json({ error: 'Admin not found' });
        return;
        }

        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete admin function
const deleteAdminById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedAdmin = await Admin.findByIdAndDelete(id);
        if (!deletedAdmin) {
        return res.status(404).json({ error: 'Admin not found' });
        }

        res.status(200).json(deletedAdmin);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update an admin by ID
const updateAdminById = async (req, res) => {
    const { id } = req.params;
    try {
        const { username, password } = req.body;

        if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedAdmin = await Admin.findByIdAndUpdate(
        id,
        { username, password: hashedPassword },
        { new: true }
        );

        if (!updatedAdmin) {
        return res.status(404).json({ error: 'Admin not found' });
        }

        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export {
    createAdmin,
    findAllAdmins,
    updateAdminById,
    deleteAdminById,
    loginAdmin,
    getAdminbyId,
};