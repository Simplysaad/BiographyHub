const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const passport = require('passport')
//const localStrategy = require('passport-local')

const post = require("../models/post.model.js");
const user = require("../models/user.model.js");
const authMiddleware = require("../utils/auth.js");

const locals = {
    title: "BiographyHub | Admin",
    imageUrl: "/IMG/brand-image.png"
};


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
 * ADMIN - get all posts related to a single user
 * For now it should find all posts*
 * requires authentication with "authMiddleware"
 */

router.get("/dashboard", authMiddleware, async (req, res, next) => {
    try {
        let currentUserId = await getAuthorId(req);
        //const myPosts = await post.find({authorId: currentUserId});
        let myPosts;
        if (req.session.username === "JustSaad") {
            myPosts = await post.find({});
        } else {
            myPosts = await post.find({ authorId: currentUserId });
        }
        //const myPosts = await post.find({});
        locals.title = "BiographyHub | Dashboard";

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

router.get("/admin/add-post", authMiddleware, async (req, res, next) => {
    try {
        locals.title = "BiographyHub | Add post";
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

router.post("/admin/add-post", authMiddleware, async (req, res, next) => {
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
router.get("/admin/edit-post/:id", authMiddleware, async (req, res, next) => {
    try {
        let myPost = await post.findOne({ _id: req.params.id });

        //console.log(myPost);
        locals.title = "BiographyHub | Edit post";
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
router.post("/admin/edit-post/:id", authMiddleware, async (req, res, next) => {
    //console.log("you are trying to edit", req.params.id);
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

router.get("/admin/delete-post/:id", authMiddleware, async (req, res, next) => {
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
