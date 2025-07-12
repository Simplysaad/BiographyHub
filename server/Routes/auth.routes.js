const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User.model.js");
const authMiddleware = require("../Utils/auth.js");

const locals = {
    title: "Auth | BiographyHub",
    imageUrl: "/IMG/brand-image.png",
    description: ""
};

/**
 * GET
 * ADMIN - register page
 */
router.get("/register", (req, res, next) => {
    console.log("register page is loading");
    try {
        locals.title = "Create Account | BiographyHub";
        return res.render("Pages/Auth/register", { locals, layout: "layouts/auth" });
    } catch (err) {
        next(err);
    }
});
/**
 * POST
 * ADMIN - register
 * For register, the three things we have to do is:
 * * save info to mongodb
 * * create a new user
 * * sign the web token
 */

router.post("/register", async (req, res, next) => {
    try {
        const { password, emailAddress } = req.body;
        const { bio, phoneNumber, socials } = req.body;
        //socials = { name: "instagram", url: "https://instagram.com/" };

        const isEmailExist = await User.findOne({ emailAddress }).select("_id");

        if (isEmailExist) {
            return res.status(400).json({
                success: false,
                message: "user already exists"
            });
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        let newUser = new User({
            ...req.body,
            roles: ["author", "subscriber"],
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({ sub: newUser._id }, process.env.SECRET_KEY, {
            expiresIn: "1h"
        });

        req.session.userId = newUser._id;

        res.cookie("token", token, { httpOnly: true });

        return res.status(201).json({
            success: true,
            message: "new user created successfully",
            newUser
        });
    } catch (err) {
        next(err);
    }
});

/**
 * GET
 * ADMIN -login page
 */

router.get("/login", (req, res, next) => {
    console.log("login page is loading");
    try {
        locals.title = "Login | BiographyHub";
        return res.render("Pages/Auth/login", { locals, layout: "layouts/auth" });
    } catch (err) {
        next(err);
    }
});

/**
 * POST
 * ADMIN -login
 * For login, the three things we have to do is:
 * * check info with mongodb
 * * create web token
 * * enter the dashboard if successful
 */

router.post("/login", async (req, res, next) => {
    try {
        const { emailAddress, password } = req.body;

        const currentUser = await User.findOne({
            emailAddress
        });

        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            });
        }

        const isMatch = await bcrypt.compare(password, currentUser.password);
        if (!isMatch) {
            return res.status(403).json({
                success: false,
                message: "invalid credentials"
            });
        }
        req.session.userId = currentUser._id;

        const token = jwt.sign(
            { sub: currentUser._id },
            process.env.SECRET_KEY,
            {
                expiresIn: "1h"
            }
        );
        res.cookie("token", token, { httpOnly: true });
        return res.status(200).json({
            success: true,
            message: "user logged in successfully",
            currentUser
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET
 * ADMIN - logout
 * clears the token cookie
 */

router.get("/logout", async (req, res, next) => {
    try {
        res.clearCookie("token");
        res.redirect("/login");
    } catch (err) {
        next(err);
    }
});

module.exports = router;
