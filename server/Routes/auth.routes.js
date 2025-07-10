const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const passport = require('passport')
//const localStrategy = require('passport-local')

const Post = require("../models/Post.model.js");
const user = require("../models/User.model.js");
const authMiddleware = require("../../utils/auth.js");

const locals = {
    title: "BiographyHub | Admin",
    imageUrl: "/IMG/brand-image.png"
};

/**
 * GET
 * ADMIN - register page
 */
router.get("/register", (req, res, next) => {
    console.log("register page is loading");
    try {
        locals.title = "BiographyHub | Create Account";
        res.render("admin/register", { locals, layout: "layouts/auth" });
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
        let hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
        let newUser = new user(req.body);
        if (!newUser) {
            throw new Error("");
        }
        await newUser.save();

        const token = jwt.sign({ sub: newUser._id }, process.env.SECRET_KEY, {
            expiresIn: "1h"
        });

        req.session.userId = currentUser._id;
        req.session.username = currentUser.username;

        res.cookie("token", token, { httpOnly: true });
        res.redirect("/dashboard");
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Registration Failed" });
    }
});

/**
 * GET
 * ADMIN -login page
 */

router.get("/login", (req, res, next) => {
    console.log("login page is loading");
    try {
        locals.title = "BiographyHub | Login";
        res.render("admin/login", { locals, layout: "layouts/auth" });
        //console.log("login page is loaded");
    } catch (err) {
        console.error(err);
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
        const { username, password } = req.body;
        const currentUser = await user.findOne({
            $or: [{ username: username }, { emailAddress: username }]
        });
        if (!currentUser) {
            console.log("user not found");
            return res.status(404).json({ message: "user not found" });
        }

        const isMatch = await bcrypt.compare(password, currentUser.password);
        if (!isMatch) {
            console.log("invalid credentials");
            return res.status(401).send({ message: "invalid credentials" });
        }
        req.session.userId = currentUser._id;
        req.session.username = currentUser.username;

        const token = jwt.sign(
            { sub: currentUser._id },
            process.env.SECRET_KEY,
            {
                expiresIn: "1h"
            }
        );
        res.cookie("token", token, { httpOnly: true });
        res.redirect("/dashboard");
    } catch (error) {
        console.error(error);
    }
});

/**
 * GET
 * ADMIN - logout
 * clears the token cookie
 */

router.get("/logout", async(req, res, next) => {
    try {
        res.clearCookie("token");
        res.redirect("/login");
    } catch (err) {
        next(err);
    }
});

module.exports = router;
