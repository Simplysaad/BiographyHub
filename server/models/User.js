const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bio: String,
    imageUrl: String,
    socialLink: String
});

const user = mongoose.model("user", UserSchema);

module.exports = user;
