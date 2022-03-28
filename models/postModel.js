const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    description: {
        type: String,
        default: ""

    },
    image: {
        type: String,
        required: true
    },
    comments: [{ user: { type: mongoose.Schema.Types.ObjectID, ref: "users" }, date: { type: String, required: true }, comment: { type: String, required: true } }],
    likes: [
        {
            user: { type: mongoose.Schema.Types.ObjectID, ref: "users" },
            date: { type: String, required: true },
        },
    ],
    //who posted?
    user: { type: mongoose.Schema.Types.ObjectID, ref: "users" }
}, { timestamps: true }
)

module.exports = mongoose.model("posts", PostSchema);