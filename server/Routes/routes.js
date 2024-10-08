//routes.js

const express = require("express");
const dummyData = require("./dummyData");
const router = express.Router();
const post = require("../models/Post");
const helper = require('../../utils/helper')
const locals = {
  title: "BiographyHub | ",
};

//console.log(allPosts)

const relatedPostsFunc = helper.relatedPostsFunc

const readTime = helper.readTime





router.get("/", async (req, res) => {
  try {
    //let images = returnImages()
    const allPosts = await post.find().exec();

    
    res.render("pages/index", { locals, allPosts, readTime});
  } catch (err) {
    console.log(err);
  }
});

router.get('/author/:name', async(req, res)=>{
  try {
    let name = req.params.name;
    let authorPosts = await post.find({author: name}).then((data)=>{
      res.render('pages/author', {locals, data, name, readTime})
    })


    
  } catch (error) {
    console.log(error)
  }
})

router.get("/article/:id", async (req, res) => {
  try {
    let article = await post.findById(req.params.id);

    const allPosts = await post.find().exec();

    let relatedPosts = relatedPostsFunc(allPosts);

    res.render("pages/article", { locals, article, relatedPosts, readTime });
  } catch (err) {
    console.log(err);
  }
});


router.get("/category/:categoryName", async (req, res) => {
  try {
    let categoryName = req.params.categoryName;
    const categoryPosts = await post.find({ category: categoryName }).exec();

    res.render("pages/category", { locals, categoryPosts, categoryName, readTime });
  } catch (err) {
    console.log("error occured");
  }
});

router.post("/search", async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let newRegex = new RegExp(searchTerm, "i")
    let searchResults = await post
      .find({
        $or: [
          { category: { $regex: newRegex } },
          { title: { $regex: newRegex} },
          { content: { $regex: newRegex} },
          { imageUrl: { $regex: newRegex } },
          { author: { $regex: newRegex} },
          {category: {$regex: newRegex} }
        ],
      })
      .exec();

    res.render("pages/search", { locals, searchResults });
  } catch (err) {
    console.log(err);
  }
});

router.get("/*", (req, res) => {
  res.render("pages/404", { locals });
});
module.exports = router;
           
