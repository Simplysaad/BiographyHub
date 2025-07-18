const cron = require("node-cron");
//require("dotenv").config();

const generateTopic = require("./generateTopic.js");
const generatePost = require("./generatePost.js");
const postTweet = require("./postTwitter.js");
const { generateSlug } = require("./generateSlug.js");

async function automate() {
    let post = await generatePost();
    let query = post.keywords?.join("+") || post.tags?.join("+")

    let unsplashResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
            }
        }
    );

    if (!unsplashResponse.ok) {
        return {
            success: false,
            message: "error while retrieving unsplashResults"
        };
    }

    let unsplashResults = await unsplashResponse.json();
    let imageUrl = unsplashResults.results[0].urls.raw;

    let response = await fetch(`${process.env.BASE_URL}/admin/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: process.env.BOT_API_KEY
        },
        body: JSON.stringify({ ...post, imageUrl })
    });
    let { data: newPost } = await response.json();

    let slug = generateSlug(newPost);
    let url = "https://biographyhub.onrender.com/article/" + slug;
    const twitterPost = await postTweet(newPost.title, url);

    return {
        newPost,
        imageUrl,
        twitterPost
    };
}

module.exports = automate;

//results[0].urls.raw
