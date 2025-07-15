const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Post = require("../Models/post.model.js");
const User = require("../Models/user.model.js");
const Category = require("../Models/category.model.js");

const authMiddleware = require("../Utils/auth.middleware.js");
const generateApiKey = require("../Utils/generateApiKey.js");
const automate = require("../Utils/automate.js");

const locals = {
    title: "BiographyHub",
    imageUrl: "/IMG/brand-image.png",
    description:
        "Stay ahead with expert insights on AI, emerging tech, digital marketing strategies, and productivity tools to supercharge your growth.",
    url: "https://biographyhub.onrender.com/admin"
};

router.use(authMiddleware);

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

        if (currentUser.roles.includes("admin")) {
            currentUserPosts = await Post.find({});
        } else {
            currentUserPosts = await Post.find({ authorId: currentUser._id });
        }

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

        const categories = await Category.find({ parent: null }).select(
            "name _id"
        );
        const subCategories = await Category.find({
            parent: { $ne: null }
        }).select("name _id");

        let categoriesArray = [];

        categories.forEach(category => {
            let children = subCategories.filter(
                subCategory => subCategory.parent === category._id
            );

            categoriesArray.push({
                parent: category,
                children
            });
        });

        res.status(200).render("Pages/Admin/add_post", {
            locals,
            layout: "Layouts/admin",
            categoriesArray
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

        const {
            title,
            description,
            content,
            imageUrl,
            tags,
            category,
            subCategory
        } = req.body;

        let parent = await Category.findOne({
            name: category.toLowerCase().trim()
        });
        // let mainCategory = await Category.findOneAndUpdate(
        //     { name: subCategory },
        //     {
        //         $set: {
        //             name: subCategory,
        //             parent: parent._id,
        //             ancestors: [...parent.ancestors, parent._id],
        //             slug: (subCategory )?.toLowerCase().trim().replace(/\W+/g, "-")
        //         }
        //     },
        //     { upsert: true, new: true }
        // );

        //let description = await generateDescription(content)
        //let title = await generateTitle(content)

        let newPost = new Post({
            ...req.body,
            category: parent._id,
            authorId: currentUser._id
            // ,category: mainCategory._id,
        });
        await newPost.save();

        return res.status(201).json({
            success: true,
            message: "post created successfully",
            data: newPost
        });

        // return res.redirect("/article/" + newPost.slug);
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

        // return res.status(200).json({
        //     succes: true,
        //     message: "post retrieved successfully",
        //     currentPost
        // });

        return res.render("Pages/Admin/edit_post", {
            locals,
            currentPost,
            layout: "Layouts/admin"
        });
    } catch (err) {
        next(err);
    }
});

/**
 * PUT
 * ADMIN -edit-post
 * completed successfully
 */

router.post("/posts/:id", async (req, res, next) => {
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
        // return res.status(201).json({
        //     success: true,
        //     message: "post updated successfully",
        //     updatedPost
        // });

        return res.redirect("/admin/");
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
