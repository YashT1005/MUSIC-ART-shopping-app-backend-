const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
    try {
        const { name, mobile, email, password } = req.body;

        if (!name || !mobile || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Pease fill the credentials",
            });
        }

        let userEmail = await User.findOne({ email });
        if (userEmail) {
            return res.status(200).json({
                success: false,
                message: "Email already exists",
            });
        }

        let userMobile = await User.findOne({ mobile });
        if (userMobile) {
            return res.status(200).json({
                success: false,
                message: "Mobile already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = await User.create({
            name,
            mobile,
            email,
            password: hashedPassword,
        });

        const token = await jwt.sign(
            { userId: userData._id },
            process.env.JWT_SECRET
        );

        res.status(200).json({
            success: true,
            name: userData.name,
            token,
        });
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { emailORmobile, password } = req.body;

        if (!emailORmobile || !password) {
            return res.status(400).json({
                errorMessage: "Bad request! Invalid credentials",
                success: false,
            });
        }

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailORmobile);

        let query = {};
        if (isEmail) {
            query.email = emailORmobile;
        } else {
            // Assuming mobile number is stored as a string in the database
            query.mobile = emailORmobile;
        }

        const userDetails = await User.findOne(query);

        if (!userDetails) {
            return res
                .status(200)
                .json({ success: false, message: "User not found, please sign up !" });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            userDetails.password
        );

        if (!passwordMatch) {
            return res
                .status(200)
                .json({ success: false, message: "Incorrect password" });
        }

        const token = await jwt.sign(
            { userId: userDetails._id },
            process.env.JWT_SECRET
        );

        res.json({
            success: true,
            message: "Login Successfull",
            token: token,
            name: userDetails.name,
        });
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};