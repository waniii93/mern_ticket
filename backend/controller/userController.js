import Users from "../model/users.js";
import jwt from "jsonwebtoken";

export const createUser = async(req, res) => {
    try{
        const newUser = new Users(req.body);
        console.log(newUser);
        // Define email
        const { email } = newUser;
        const userExist = await Users.findOne({ email });

        if(userExist) {
            return res.status(400).json({ message: "User already exists." });
        }

        const savedUser = await newUser.save();

        res.status(201).json({ message: "User created successfully."});
    } catch (error){
        console.error("Error saving user:", error.message);
        res.status(500).json({ errorMessage: error.message});
    }
}

export const getUsers = async(req, res) => {
    try{
        const page = parseInt(req.query.page) || null;
        const limit = parseInt(req.query.limit) || null;

        let userData;

        // Filters
        const user_group = req.query.user_group || null;
        const is_exclude_customers = req.query.is_exclude_customers === "true";

        let filter_data = {};

        if (is_exclude_customers) {
            filter_data.user_group = { $ne: "Customer" }; // Exclude 'Customer' user group
        }

        console.log(filter_data);

        const totalUsers = await Users.countDocuments(filter_data);

        if (page && limit) {
            // Apply pagination if page and limit are provided
            const skip = (page - 1) * limit;
            userData = await Users.find(filter_data).skip(skip).limit(limit);
        } else {
            // Return all users if no pagination parameters are provided
            userData = await Users.find(filter_data);
        }

        res.status(200).json({
            users: userData, // Tickets for the current page
            total: totalUsers, // Total number of users
        });
    } catch (error){
        console.error("Error fetching users:", error.message);
        res.status(500).json({ errorMessage: "Something went wrong. Please try again later." });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Compare the entered password with the stored hashed password
        const is_password_matched = await user.comparePassword(password);
        if (!is_password_matched) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Generate a JWT token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                name: user.name,
                user_group: user.user_group
            },
            process.env.JWT_SECRET, // Use an environment variable for your JWT secret
            {
                expiresIn: "1h"
            }
        );

        // Respond with token and user info
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                user_group: user.user_group,
            },
            token
        });
    } catch (error) {
        console.error("Error to login:", error.message);
        res.status(500).json({ errorMessage: error.message});
    }
};