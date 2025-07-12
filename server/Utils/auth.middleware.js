const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const user = require("../Models/user.model.js");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(403).json({
                success: false,
                message: "user logged in"
            });
        }
        const { userId } = jwt.verify(token, process.env.SECRET_KEY);
        req.session.userId = userId;
        next();
    } catch (err) {
        next(err);
        res.redirect("/login");
    }
};

module.exports = authMiddleware;
