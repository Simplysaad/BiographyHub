const express = require("express");
//const dummyData = require("./dummyData");
const router = express.Router();
const cron = require("node-cron");

const Post = require("../Models/post.model.js");
const User = require("../Models/user.model.js");
const Category = require("../Models/category.model.js");

const helper = require("../Utils/helper");
const automate = require("../Utils/automate.js");

const locals = {
    title: "BiographyHub",
    imageUrl: "/IMG/brand-image.png",
    description:
        "Stay ahead with expert insights on AI, emerging tech, digital marketing strategies, and productivity tools to supercharge your growth.",
    url: "https://biographyhub.onrender.com/"
};

const dummyData = require("../Utils/posts.js");
const relatedPostsFunc = helper.relatedPostsFunc;
const readTime = helper.readTime;

/**
 * GET
 * main -index page
 */

router.get("/", async (req, res, next) => {
    try {
        //ENSURE THAT THE POSTS RETURNED ARE PUBLISHED {status: "published"}

        const allPosts = await Post.find({})
            .sort({ updatedAt: -1 })
            .limit(40)
            .select("title slug description updatedAt imageUrl meta");

        const recentPosts = await Post.find({})
            .sort({ updatedAt: -1 })
            .limit(40)
            .select("title slug description updatedAt imageUrl meta");
        const topPosts = await Post.find({})
            .sort({ "meta.likes": -1, "meta.views": -1 })
            .limit(40)
            .select("title slug description updatedAt imageUrl meta");

        return res.render("Pages/Main/index", {
            locals,
            allPosts,
            recentPosts,
            topPosts
        });
    } catch (err) {
        next(err);
    }
});

router.post("/automate", async (req, res, next) => {
    try {
        const response = await automate();

        if (response.success) {
            return res.json({
                success: false,
                message: "could not be posted",
                response
            });
        }
        return res.json({
            success: true,
            message: "posted successfully",
            response
        });
    } catch (err) {
        next(err);
    }
});

/**
 * GET
 * MAIN -get all posts by the same author
 */
router.get("/author/:slug", async (req, res, next) => {
    try {
        const { slug } = req.params;
        const authorId = slug.split("-").at(-1);
        const authorPosts = await Post.find({ authorId });

        return res.render("Pages/Main/author", {
            locals,
            authorPosts,
            name,
            readTime
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET
 * MAIN - get a specific article
 * @params {String} id
 */

router.get("/article/:slug", async (req, res, next) => {
    try {
        let { slug } = req.params;

        let update = {};

        if (req.query.like) {
            update = {
                "meta.likes": 1
            };
        } else {
            update = {
                "meta.views": 1
            };
        }
        let articleId = slug.split("-").at(-1);
        const article = await Post.findByIdAndUpdate(
            articleId,
            { $inc: update },
            { new: true }
        ).populate("authorId");

        if (req.query.like) return;

        const { authorId: author } = article;
        const relatedPosts = await Post.aggregate([{ $sample: { size: 6 } }]);

        locals.title = article.title + " - BiographyHub";
        locals.description = article.description;
        locals.imageUrl = article.imageUrl;

        return res.render("Pages/Main/article", {
            locals,
            article,
            author,
            relatedPosts
        });
    } catch (err) {
        next(err);
    }
});
router.post("/category", async (req, res) => {
    try {
        const { name, description, parent } = req.body;

        if (parent) {
            const parentCategory = await Category.findOne({
                name: parent.toLowerCase().trim()
            });
        }

        let newCategory = new Category({
            name,
            description,
            parent,
            slug: name.toLowerCase().replace(/!W+/g, "-").split(" ").join("-")
        });

        console.log(newCategory);

        await newCategory.save();

        return res.status(201).json({
            success: true,
            message: "new category added successfully",
            newCategory
        });
    } catch (err) {
        next(err);
    }
});
/**
 * GET
 * MAIN - get all posts in the same category
 */

router.get("/category/:slug/", async (req, res, next) => {
    try {
        let { slug } = req.params;

        slug = slug.toLowerCase().split("-").join(" ");

        const categoryPosts = await Post.find({ category: slug });

        const category = await Category.findOne({ name: slug });

        locals.title = category.name + " - BiographyHub";
        locals.description = category.description;

        return res.render("Pages/Main/category", {
            locals,
            categoryPosts,
            category
        });
    } catch (err) {
        next(err);
    }
});

/**
 * GET
 * MAIN - search for posts that match the search searchTerm
 * search author, tags, content, title, imageUrl
 */

router.post("/search", async (req, res, next) => {
    try {
        let searchTerm = req.body.searchTerm;
        let newRegex = new RegExp(searchTerm, "i");

        let searchResults = await Post.find({
            $or: [
                { category: { $regex: newRegex } },
                { title: { $regex: newRegex } },
                { content: { $regex: newRegex } },
                { imageUrl: { $regex: newRegex } },
                { author: { $regex: newRegex } },
                { category: { $regex: newRegex } }
            ]
        });

        locals.title = `Results for ${searchTerm}`;
        locals.description = `Your search for ${searchTerm}, brought ${
            searchResults.length ?? "no"
        } results `;

        return res.render("Pages/Main/search", { locals, searchResults });
    } catch (err) {
        next(err);
    }
});

/**
 * POST
 * MAIN - adds a new subscriber
 */

router.post("/subscribe", async (req, res, next) => {
    try {
        let { emailAddress, name } = req.body;
        let newSubscriber = new User({ emailAddress, name });

        await newSubscriber.save();
    } catch (error) {
        next(error);
    }
});

/**
 * 404
 * THIS PAGE COULD NOT BE FOUND
 */

router.get("/*path", (req, res, next) => {
    res.render("Pages/Error/404", { locals });
});

module.exports = router;
