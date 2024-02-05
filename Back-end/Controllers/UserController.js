import express from 'express';
import bcrypt from 'bcrypt';
import User from "../models/UserModel.js"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.SECRET;

// Create JWT token upon signing in
const createToken = (id) => {
    return jwt.sign({ id }, secret, { expiresIn: '3d' });
};

// Create a new user
const createUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
        return res.status(400).json({ error: 'User with this username already exists' });
        }

        const newUser = new User({ username, password });
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

// Login function for users
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
        }

        const existingUser = await User.findOne({ username });
        if (!existingUser) {
        return res.status(400).json({ error: 'User not found' });
        }

        const match = await bcrypt.compare(password, existingUser.password);
        if (!match) {
        return res.status(400).json({ error: 'Incorrect password' });
        }

        const token = createToken(existingUser._id);
        return res.status(200).json({ username, token });
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

// Get All users
const findAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

// Get Specific user
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete user function
const deleteUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update a user by ID
const updateUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const { username, password } = req.body;

        if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await User.findByIdAndUpdate(
        id,
        { username, password: hashedPassword },
        { new: true }
        );

        if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export {
    createUser,
    findAllUsers,
    updateUserById,
    deleteUserById,
    loginUser,
    getUserById,
};
