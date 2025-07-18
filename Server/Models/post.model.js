const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
    {
        title: {
            required: true,
            type: String
        },
        content: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        imageUrl: {
            type: String,
            default: "https://picsum.photos/600/400"
        },
        // category: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "categories"
        // },
        tags: [String],
        status: {
            type: String,
            enum: ["published", "draft", "archived"],
            default: "draft"
        },
        meta: {
            views: {
                type: Number,
                default: 0
            },
            likes: {
                type: Number,
                default: 0
            },
            commentsCount: {
                type: Number,
                default: 0
            },
            sources: [
                {
                    name: String,
                    count: {
                        type: Number,
                        default: 0
                    }
                }
            ]
        }
    },
    { timestamps: true }
);

postSchema.index({ authorId: 1 });

postSchema.virtual("slug").get(function () {
    let regex = new RegExp("[^\\w]+", "ig");
    return this.title.toLowerCase().replace(regex, "-") + "--" + this._id;
});
postSchema.virtual("readTime").get(function () {
    const words = this.content.split(" ").length;
    return Math.ceil(words / 200) + " min read";
});

module.exports = mongoose.models.post || mongoose.model("post", postSchema);
