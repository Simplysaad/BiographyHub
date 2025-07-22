const express = require("express");
//const dummyData = require("./dummyData");
const router = express.Router();
const cron = require("node-cron");
const mongoose = require("mongoose");

const Post = require("../Models/post.model.js");
const User = require("../Models/user.model.js");
const Category = require("../Models/category.model.js");

const helper = require("../Utils/helper");
const automate = require("../Utils/automate.js");
const searchPictures = require("../Utils/searchPicture.js");
const { generateSlug } = require("../Utils/generateSlug.js");

const locals = {
    title: "BiographyHub",
    imageUrl: "/IMG/brand-image.png",
    description:
        "Stay ahead with expert insights on AI, emerging tech, digital marketing strategies, and productivity tools to supercharge your growth.",
    url: "https://biographyhub.onrender.com/"
};

router.use(async (req, res, next) => {
    try {
        const categories = await Category.find({})
            .select("_id name slug")
            .sort({ post_count: -1 });

        res.locals.categories = categories;
        next()
    } catch (err) {
        console.error(err);
    }
});

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
            .populate("category")
            .sort({ updatedAt: -1 })
            .limit(10)
            .select("title slug description category updatedAt imageUrl meta");

        const postsByCategory = await Post.aggregate([
            {
                $group: {
                    _id: "$category",
                    posts: { $push: "$$ROOT" }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $project: {
                    _id: 1,
                    name: "$category.name",
                    posts: 1
                }
            }
        ]);
        console.log("postsByCategory", postsByCategory);

        const recentPosts = await Post.find({})
            .sort({ updatedAt: -1 })
            .limit(10)
            .select("title slug description category updatedAt imageUrl meta");
        const topPosts = await Post.find({})
            .sort({ "meta.likes": -1, "meta.views": -1 })
            .limit(10)
            .select("title slug description category updatedAt imageUrl meta");

        return res.render("Pages/Main/index", {
            locals,
            allPosts,
            recentPosts,
            topPosts,
            postsByCategory
        });
    } catch (err) {
        next(err);
    }
});

router.get("/automate", async (req, res, next) => {
    try {
        const response = await automate();
        // const { newPost, twitterPost, success } = await response.json();
        // const data = await response.json();

        // if (!data.success) {
        //     return res.json({
        //         success: false,
        //         message: "could not be posted",
        //         response
        //     });
        // }
        return res.json({
            ...response
        });
    } catch (err) {
        next(err);
    }
});

/**
 * GET
 * MAIN -get all posts by the same author
 */
router.get(["/author/", "/author/:slug"], async (req, res, next) => {
    try {
        const { slug } = req.params;
        const authorId = slug?.split("-").at(-1);
        const isValidObjectId = mongoose.Types.ObjectId.isValid(authorId);

        if (!slug || !isValidObjectId) {
            let [randomAuthor] = await User.aggregate([
                { $match: { roles: "author" } },
                { $sample: { size: 1 } },
                { $project: { _id: 1 } }
            ]);

            return res.redirect(`/author/${randomAuthor._id}`);
        }

        const authorPosts = await Post.find({ authorId });
        const author = await User.findById(authorId);

        return res.render("Pages/Main/author", {
            locals,
            authorPosts,
            author
        });
    } catch (err) {
        next(err);
    }
});

/**
 * GET
 * MAIN - get a specific article
 * @params {String} id
 */

router.get(["/article/", "/article/:slug"], async (req, res, next) => {
    try {
        let { slug } = req.params;
        let articleId = slug.split("-").at(-1);

        if (req.query.like) {
            await Post.findByIdAndUpdate(
                articleId,
                {
                    $inc: {
                        "meta.likes": 1
                    }
                },
                { new: true }
            );
            return res.status(204).end();
        }

        const article = await Post.findByIdAndUpdate(
            articleId,
            {
                $inc: {
                    "meta.views": 1
                }
            },
            { new: true }
        )
            .populate("authorId")
            .populate("category");

        const isValidObjectId = mongoose.Types.ObjectId.isValid(articleId);
        if (!isValidObjectId || !article) {
            let [article] = await Post.aggregate([{ sample: { size: 1 } }]);

            let slug = generateSlug(article);

            return res.redirect(
                `https://biographyhub.onrender.com/article/${slug}`
            );
        }

        const { authorId: author } = article;
        const relatedPosts = await Post.aggregate([
            { $sample: { size: 6 } },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            }
        ]);

        relatedPosts.map(post => (post.slug = generateSlug(post)));

        locals.title = article.title + " - BiographyHub";
        locals.description = article.description;
        locals.imageUrl = article.imageUrl;

        let currentUrl = "https://biographyhub.onrender.com" + req.originalUrl;
        return res.render("Pages/Main/article", {
            locals,
            article,
            author,
            currentUrl,
            relatedPosts
        });
    } catch (err) {
        next(err);
    }
});

router.post("/category", async (req, res) => {
    try {
        let categories = [
            {
                name: "Web development",
                description:
                    "Dive into the ever-evolving world of web development—where creative code meets beautiful design. From beginner basics to advanced trends, we help you build modern websites that wow, inspire, and connect people everywhere."
            },
            {
                name: "AI/ML",
                description:
                    "Step into the future with AI and machine learning! Explore groundbreaking stories, practical projects, and guides that reveal how machine intelligence is transforming everything from business and art to everyday life."
            },
            {
                name: "Frontend Frameworks",
                description:
                    "Discover the magic behind stunning, interactive sites—React, Angular, Vue, and more. We share hands-on tutorials, expert tips, and innovative ideas to help you craft seamless experiences your users will love."
            },
            {
                name: "Backend and Databases",
                description:
                    "Peek behind the curtain at the unsung heroes of every app—robust backends and reliable databases. Learn to create scalable, secure, and lightning-fast architectures that power the world’s most exciting digital products."
            },
            {
                name: "Productivity and Tools",
                description:
                    "Supercharge your workflow with proven productivity hacks, essential tools, and insider recommendations. Whether you’re coding, creating, or collaborating, we help you work smarter—not harder—every step of the way."
            },
            {
                name: "Security and best practices",
                description:
                    "Build with confidence by mastering security essentials and industry best practices. Explore strategies to protect your code, data, and users from today’s evolving threats—security starts here."
            },
            {
                name: "Tech News and Trends",
                description:
                    "Stay tuned to the pulse of the tech world. We bring you breaking news, bold innovations, and expert insights on the latest trends shaping tomorrow’s technology landscape."
            }
        ];

        await Promise.all(
            categories.map(async category => {
                let [image] = await searchPictures(category.name);
                category.imageUrl = image.urls.raw;
                category.name = category.name.toLowerCase().trim();
                category.slug = category.name
                    .trim()
                    .toLowerCase()
                    .replace(/\W+/g, "-");
            })
        );

        let newCategories = await Category.insertMany(categories);

        return res.status(201).json({
            success: true,
            message: "new categories added successfully",
            newCategories
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

        const category = await Category.findOne({ name: slug });
        const categoryPosts = await Post.find({
            category: category._id
        }).populate("category");

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

router.all("/search", async (req, res, next) => {
    try {
        let { searchTerm } = req.query;
        let newRegex = new RegExp(searchTerm, "i");

        let searchResults = await Post.find({
            $or: [
                { tags: { $regex: newRegex } },
                { title: { $regex: newRegex } },
                { content: { $regex: newRegex } }
            ]
        });

        locals.title = `Results for ${searchTerm}`;
        locals.description = `Your search for ${searchTerm}, brought ${
            searchResults.length ?? "no"
        } results `;

        return res.render("Pages/Main/search", {
            locals,
            searchTerm,
            searchResults
        });
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
