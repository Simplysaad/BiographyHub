const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const passport = require('passport')
//const localStrategy = require('passport-local')

const post = require("../models/Post.js");
const user = require("../models/User.js");
const authMiddleware = require("../../utils/auth.js");

const locals = {
    title: "BiographyHub | Admin"
};

/**
 * GET
 * ADMIN - register page
 */
router.get("/register", (req, res) => {
    console.log("register page is loading");
    try {
        console.log("register page is loaded");
        res.render("admin/register", { locals });
    } catch (err) {
        console.error(err);
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

router.post("/register", async (req, res) => {
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

router.get("/login", (req, res) => {
    console.log("login page is loading");
    try {
        res.render("admin/login", { locals });
        console.log("login page is loaded");
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

router.post("/login", async (req, res) => {
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
 * ADMIN - finds the authorId from the current user session
 * @params {req}
 */
async function getAuthorId(req) {
    try {
        const userId = req.session.userId;
        const currentUser = await user.findOne({ _id: userId });
        console.log(currentUser);
        const currentUserId = currentUser._id;

        console.log(currentUserId);
        return currentUserId;
    } catch (err) {
        console.error(err);
    }
}


/**
 * GET
 * ADMIN - logout
 * clears the token cookie
 */

router.get("/logout", (req, res)=>{
  res.clearCookie('token')
  res.redirect("/login")
})



/**
 * GET
 * ADMIN - get all posts related to a single user
 * For now it should find all posts*
 * requires authentication with "authMiddleware"
 */

router.get("/dashboard", authMiddleware, async (req, res) => {
    try {
        let currentUserId = await getAuthorId(req);
        //const myPosts = await post.find({authorId: currentUserId});
        let myPosts;
        if(req.session.username === "JustSaad"){
            myPosts = await post.find({})
        }
        else{
            myPosts = await post.find({authorId: currentUserId})
        }
        //const myPosts = await post.find({});

        res.render("admin/dashboard", {
            locals,
            myPosts,
            layout: "layouts/admin"
        });
    } catch (err) {
        console.error(err);
    }
});

/**
 * GET
 * ADMIN - render the edit page to edit a single article
 * requires authentication with "authMiddleware"
 */

router.get("/admin/add-post", authMiddleware, async (req, res) => {
    try {
        res.render("admin/add_post", {
            locals,
            layout: "layouts/admin"
        });
    } catch (err) {
        console.log(err);
    }
});

/**
 * POST
 * ADMIN -create post
 * now working perfectly(not yet)
 * still requires authentication with "authMiddleware"
 */

router.post("/admin/add-post", authMiddleware, async (req, res) => {
    try {
        if (!req.body) {
            throw new Error("request body not found");
        }
        let currentUserId = await getAuthorId(req);
        let username = req.session.username;
        if (!currentUserId || !username) {
            throw new Error("user not logged in");
        }

        req.body.tags = req.body.tags.split(",");

        //const {title, content, imageUrl, tags, birthDate, deathDate } = req.body
        console.log(req.body.tags);
        const reqBody = req.body;
        console.log("reqBody", reqBody);

        let newPost = new post({
            ...reqBody,
            author: username,
            authorId: currentUserId
        });
        console.log("newPost", newPost);
        await newPost.save().then(res.redirect("/dashboard"));
    } catch (err) {
        console.log(err, "error while inserting new post");
    }
});

/**
 * GET
 * ADMIN -edit post
 * excecuted successfully(not yet)
 * still requires authentication with "authMiddleware"
 */
router.get("/admin/edit-post/:id", authMiddleware, async (req, res) => {
    try {
        let myPost = await post.findOne({ _id: req.params.id });

        console.log(myPost);
        res.render("admin/edit_post", {
            locals,
            myPost,
            layout: "layouts/admin"
        });
    } catch (err) {
        console.log(err);
    }
});

/**
 * POST
 * ADMIN -edit-post
 * completed successfully
 */
router.post("/admin/edit-post/:id", authMiddleware, async (req, res) => {
    console.log("you are trying to edit", req.params.id);
    try {
        let updatedPost = await post.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    updatedAt: Date.now()
                    //,tags: req.body.tagString.split(',')
                }
            }
        );
        console.log(updatedPost, "post updated successfully");
        res.redirect("/dashboard");
    } catch (error) {
        console.error(error);
    }
});

/**
 * DELETE
 * ADMIN -delete post
 * I should use the DELETE method, not GET
 */

router.get("/admin/delete-post/:id", authMiddleware, async (req, res) => {
    console.log("you are trying to delete: ", req.params.id);
    try {
        let deletedPost = await post.deleteOne({ _id: req.params.id });
        if (!deletedPost) {
            throw new InternalError("cannot find post to delete");
        }
        console.log("post deleted successfully ");
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
    }
});
module.exports = router;
