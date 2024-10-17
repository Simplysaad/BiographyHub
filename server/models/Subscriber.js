const mongoose = require("mongoose");

const SubscriberSchema = new mongoose.Schema({
    name: {
        type: String
        //required: true
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true
    }
});

const subscriber = mongoose.model("Subscriber", SubscriberSchema);
module.exports = subscriber