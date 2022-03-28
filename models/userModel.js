const mongoose = require("mongoose");

//here check speallings
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: 'Please enter your username',
    },
    password: {
        type: String,
        required: 'Please enter your password',
    },
    privateAccount: {
        type: Boolean,
        required: false,
        default: false

    },
    //type:mongoose.Schema.Types.ObjectId here if we want to take ref from collection
    followers: [{ type: mongoose.Schema.Types.ObjectId, req: 'users' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, req: 'users' }],
    profilePicUrl: {
        type: String,
        required: false,
        default: ""
    },
    bio: {
        type: String,
        required: false,
        default: ""
    },
    savedPosts: [],
    archeivedPosts: []
}, {
    //time
    timestamps: true
})


//export and import in 
module.exports = mongoose.model("users", userSchema);