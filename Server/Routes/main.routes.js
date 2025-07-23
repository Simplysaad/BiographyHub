const express = require("express");
//const dummyData = require("./dummyData");
const router = express.Router();
const cron = require("node-cron");

const mainController = require("../Controllers/main.controller.js");
const Category = require("../Models/category.model.js");

router.use(async (req, res, next) => {
    try {
        const categories = await Category.find({})
            .select("_id name slug")
            .sort({ post_count: -1 });

        res.locals.categories = categories;
        next();
    } catch (err) {
        console.error(err);
    }
});

/**
 * GET
 * main -index page
 */

router.get("/", mainController.getHome);

router.get("/automate", mainController.automate);

/**
 * GET
 * MAIN -get all posts by the same author
 */

router.get(["/author/", "/author/:slug"], mainController.getAuthor);

/**
 * GET
 * MAIN - get a specific article
 * @params {String} id
 */

router.get(["/article/", "/article/:slug"], mainController.getArticle);

router.post("/category", mainController.postCategory);
/**
 * GET
 * MAIN - get all posts in the same category
 */

router.get("/category/:slug/", mainController.getCategory);

/**
 * GET
 * MAIN - search for posts that match the search searchTerm
 * search author, tags, content, title, imageUrl
 */

router.all("/search", mainController.allSearch);
router.get("/autocomplete", mainController.getAutocomplete);

/**
 * POST
 * MAIN - adds a new subscriber
 */

router.post("/subscribe", mainController.postSubscribe);

/**
 * 404
 * THIS PAGE COULD NOT BE FOUND
 */

router.get("/*path", (req, res, next) => {
    return res.render("Pages/Error/404", {});
});

module.exports = router;
