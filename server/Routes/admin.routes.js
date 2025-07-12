const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Post = require("../models/Post.model.js");
const User = require("../models/user.model.js");
const authMiddleware = require("../utils/auth.js");

const locals = {
    title: "Admin | BiographyHub",
    imageUrl: "/IMG/brand-image.png",
    description: ""
};

// router.use(authMiddleware);

/**
 * GET
 * ADMIN - get all posts related to a single user
 * For now it should find all posts*
 * requires authentication with "authMiddleware"
 */

router.get("/", async (req, res, next) => {
    try {
        let { userId } = req.session;
        let currentUser = await User.findById(userId);

        if (!currentUser) {
            return res.status(403).json({
                success: false,
                message: "user not logged in"
            });
        }

        let currentUserPosts = [];

        //  if (currentUser.roles.includes("admin")) {
        currentUserPosts = await Post.find({});
        // } else {
        //     currentUserPosts = await Post.find({ authorId: currentUser._id });
        // }
        locals.title = "Admin Dashboard | BiographyHub";

        res.render("Pages/Admin/dashboard", {
            locals,
            currentUserPosts,
            layout: "Layouts/admin"
        });
    } catch (err) {
        next(err);
    }
});

/**
 * GET
 * ADMIN - render the edit page to edit a single article
 * requires authentication with "authMiddleware"
 */

router.get("/posts/add", async (req, res, next) => {
    try {
        locals.title = "Create Post | BiographyHub";
        res.status(200).render("admin/add_post", {
            locals,
            layout: "Layouts/admin"
        });
    } catch (err) {
        next(err);
    }
});

/**
 * POST
 * ADMIN -create post
 * now working perfectly(not yet)
 * still requires authentication with "authMiddleware"
 */

router.post("/posts", async (req, res, next) => {
    try {
        let { userId } = req.session;
        const currentUser = await User.findOne({ _id: userId });

        if (!currentUser) {
            return res.status(403).json({
                success: false,
                message: "user not logged in"
            });
        }

        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "empty request"
            });
        }

        const { title, description, content, imageUrl, tags } = req.body;

        //let description = await generateDescription(content)
        //let title = await generateTitle(content)

        let newPost = new Post({
            ...req.body,
            // description,
            tags: tags.split(","),
            authorId: currentUser._id
        });
        await newPost.save();

        return res.status(201).json({
            success: true,
            message: "post created successfully",
            newPost
        });
    } catch (err) {
        next(err);
    }
});

/**
 * GET
 * ADMIN -edit post
 * excecuted successfully(not yet)
 * still requires authentication with "authMiddleware"
 */
router.get("/posts/:id", async (req, res, next) => {
    try {
        let currentPost = await Post.findById(req.params.id);
        locals.title = "Edit post | BiographyHub";

        let { userId } = req.session;
        const currentUser = await User.findById(userId);

        let authorized =
            currentPost.authorId === currentUser._id ||
            currentUser.roles.includes("admin");

        if (!authorized) {
            return res.status(403).json({
                success: false,
                message: "insufficient authorization"
            });
        }

        return res.status(200).json({
            succes: true,
            message: "post retrieved successfully",
            currentPost
        });

        // return res.render("Pages/Admin/edit_post", {
        //     locals,
        //     currentPost,
        //     layout: "Layouts/admin"
        // });
    } catch (err) {
        next(err);
    }
});

/**
 * POST
 * ADMIN -edit-post
 * completed successfully
 */

router.put("/posts/:id", async (req, res, next) => {
    try {
        let { title, content, tags, imageUrl } = req.body;

        req.body.tags ? req.body.tags.split(",") : null;

        let updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    ...req.body,
                    updatedAt: Date.now()
                }
            },
            { new: true }
        );
        if (!updatedPost) {
            return res.status(201).json({
                success: false,
                message: "post not found and could not be updated"
            });
        }
        return res.status(201).json({
            success: true,
            message: "post updated successfully",
            updatedPost
        });
    } catch (error) {
        next(error);
    }
});
/**
 * DELETE
 * ADMIN - delete post
 * I should use the DELETE method, not GET
 */

router.delete("/posts/:id", async (req, res, next) => {
    try {
        let deletedPost = await Post.findByIdAndDelete(req.params.id);

        if (!deletedPost) {
            return res.status(201).json({
                success: false,
                message: "post could not be deleted"
            });
        }
        return res.status(201).json({
            success: true,
            message: "post deleted successfully",
            deletedPost
        });
    } catch (err) {
        next(err);
    }
});
module.exports = router;
