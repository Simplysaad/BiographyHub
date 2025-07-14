const { TwitterApi } = require("twitter-api-v2");

const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

async function postTweet(text, url, ...paths) {
    try {
        let response;
        text = text + "\n" + url;

        if (paths.length > 0) {
            const media_ids = [];
            for (let path of paths) {
                let mediaId = await client.v1.uploadMedia(path);
                media_ids.push(mediaId);
            }

            response = await client.v2.tweet({ text, media: { media_ids } });
        } else {
            response = await client.v2.tweet(text);
        }

        // return res.status(201).json({
        //     success: true,
        //     message: "posted to twitter successfully",
        //     data: response
        // });

        return response;
    } catch (error) {
        console.error("Error posting tweet:", error);
    }
}

module.exports = postTweet;
