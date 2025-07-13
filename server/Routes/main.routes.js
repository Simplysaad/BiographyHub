const express = require("express");
//const dummyData = require("./dummyData");
const router = express.Router();

const Post = require("../Models/post.model.js");
const User = require("../Models/user.model.js");
const Category = require("../Models/category.model.js");

const helper = require("../Utils/helper");
const locals = {
    title: "BiographyHub",
    imageUrl: "/IMG/brand-image.png",
    description:
        "Find out about notable events, influential individuals and discusions"
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

        const { authorId: author } = article;
        const relatedPosts = await Post.aggregate([{ $sample: { size: 6 } }]);

        locals.description = article.description;
        locals.imageUrl = article.imageUrl;
        locals.title = article.title;

        res.render("Pages/Main/article", {
            locals,
            article,
            author,
            relatedPosts
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

        let categoryId = slug.split("-").at(-1);

        const categoryPosts = await Post.find({ categoryId }).populate(
            "categoryId"
        );

        const category = await Category.findOne({ _id: categoryId });

        locals.title = "BiographyHub | " + category.name;
        locals.description = category.description;

        res.render("Pages/Main/category", {
            locals,
            categoryPosts,
            category,
            readTime
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

// router.get("/", (req, res, next) => {
//     res.render("Pages/Error/404", { locals });
// });

module.exports = router;
