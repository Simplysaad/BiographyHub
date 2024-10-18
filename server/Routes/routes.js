const express = require("express");
//const dummyData = require("./dummyData");
const router = express.Router();
const post = require("../models/Post");
const user = require("../models/User");
const subscriber = require("../models/Subscriber.js");
const helper = require("../../utils/helper");
const locals = {
    title: "BiographyHub | "
};

//console.log(allPosts)

const relatedPostsFunc = helper.relatedPostsFunc;

const readTime = helper.readTime;
/**
 * GET
 * main -index page
 */
router.get("/", async (req, res) => {
    //changeImageUrl()
    try {
        //let images = returnImages()
        const allPosts = await post.find().sort({ updatedAt: -1 });

        res.render("pages/index", { locals, allPosts, readTime });
    } catch (err) {
        console.log(err);
    }
});

/**
 * GET 
 * MAIN -get all posts by the same author
 */
router.get("/author/:name", async (req, res) => {
    try {
        let name = req.params.name;
        let authorPosts = await post.find({ author: name }).then(data => {
            res.render("pages/author", { locals, data, name, readTime });
        });
    } catch (error) {
        console.log(error);
    }
});

/**
 * GET
 * MAIN - get a specific article
 * @params {String} id
 */

router.get("/article/:id", async (req, res) => {
    try {
        let article = await post.findById(req.params.id);

        const allPosts = await post.find().exec();

        let relatedPosts = relatedPostsFunc(allPosts);
        locals.description = article.content.substring(0, 158)
        locals.imageUrl = article.imageUrl

        res.render("pages/article", {
            locals,
            article,
            relatedPosts,
            readTime
        });
    } catch (err) {
        console.log(err);
    }
});

/**
 * GET 
 * MAIN - get all posts in the same category
 */

router.get("/category/:categoryName", async (req, res) => {
    try {
        let categoryName = req.params.categoryName;
        const categoryPosts = await post
            .find({ category: categoryName })
            .exec();

        res.render("pages/category", {
            locals,
            categoryPosts,
            categoryName,
            readTime
        });
    } catch (err) {
        console.log("error occured");
    }
});

/**
 * GET 
 * MAIN - search for posts that match the search searchTerm
 * search author, tags, content, title, imageUrl
 */

router.post("/search", async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        let newRegex = new RegExp(searchTerm, "i");

        let searchResults = await post.find({
            $or: [
                { category: { $regex: newRegex } },
                { title: { $regex: newRegex } },
                { content: { $regex: newRegex } },
                { imageUrl: { $regex: newRegex } },
                { author: { $regex: newRegex } },
                { category: { $regex: newRegex } }
            ]
        });

        res.render("pages/search", { locals, searchResults });
    } catch (err) {
        console.log(err);
    }
});

/**
 * POST
 * MAIN - adds a new subscriber
 */


router.post("/subscribe", async (req, res) => {
    try {
        let newSubscriber = new subscriber(req.body);

        await newSubscriber
            .save()
            .then(data => console.log(data, `${count}th subscriber added`));
    } catch (error) {
        console.error(error);
    }
    var count = await subscriber.countDocuments();
});

/**
 * 404
 * THIS PAGE COULD NOT BE FOUND
 */

router.get("/*", (req, res) => {
    res.render("pages/404", { locals });
});

module.exports = router;
