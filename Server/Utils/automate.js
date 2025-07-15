const cron = require("node-cron");
//require("dotenv").config();

const generateTopic = require("./generateTopic.js");
const generatePost = require("./generatePost.js");
const postTweet = require("./postTwitter.js");
const {generateSlug} = require("./generateSlug.js");

async function automate() {
    let topic = await generateTopic();
    let post = await generatePost(topic);

    let response = await fetch(`${process.env.BASE_URL}/admin/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: process.env.BOT_API_KEY
        },
        body: JSON.stringify(post)
    });
    let { data: newPost } = await response.json();

    let slug = generateSlug(newPost)
    let url = "https://biographyhub.onrender.com/article/" + slug;

    const twitterPost = await postTweet(newPost.description, url);

    return {
        newPost,
        twitterPost
    };
}

module.exports = automate;
