const express = require("express");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
const user = require(".././server/models/User");

const authMiddleware = (req, res, next) => {
    try {
        //const token = req.headers.authorization;
        const token = req.cookies.token;
        if (!token) {
            throw new Error("Unauthorized token");
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        //res.status(401)//.json({ message: "Unauthorized User" });
        res.redirect("/login");
    }
};

module.exports = authMiddleware;
