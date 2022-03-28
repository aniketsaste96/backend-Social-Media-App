const express = require("express");

const router = express.Router();
const { cloudinary } = require("../cloudinary");

//import usermodel
const User = require("../models/userModel");

//making api endpoints
//register
router.post("/register", async (req, res) => {
    try {
        //req.body =>everthing
        const newUser = new User(req.body);
        await newUser.save();
        //if everything is ok
        res.send("User registered successfully!!!");

    } catch (error) {
        res.status(500).json(error);
    }
});

//login
router.post("/login", async (req, res) => {
    try {
        //check for user in db
        //we are getting 2 things username and password
        //await***
        const user = await User.findOne({ username: req.body.username, password: req.body.password });
        if (user) {
            //if everything is ok send user
            res.send(user);
        }
        else {
            res.send("Invalid Credentials");
        }

    } catch (error) {
        res.status(500).json(error);
    }
});

//get all users 

router.get("/getallusers", async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        console.log(error);
        res.status(404).send(error);
    }
})


//follow

router.post("/followuser", async (req, res) => {

    const { currentuserid, receiveruserid } = req.body
    console.log(req.body)
    try {
        var currentuser = await User.findOne({ _id: currentuserid })
        var currentUserFollowing = currentuser.following
        currentUserFollowing.push(receiveruserid)

        currentuser.following = currentUserFollowing

        await User.updateOne({ _id: currentuserid }, currentuser)

        var receiveruser = await User.findOne({ _id: receiveruserid })
        var receiverUserFollowers = receiveruser.followers

        receiverUserFollowers.push(currentuserid)

        receiveruser.followers = receiverUserFollowers

        await User.updateOne({ _id: receiveruserid }, receiveruser)

        res.send('Followed successfully')

    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }

});


//unfollow

router.post("/unfollowuser", async (req, res) => {

    const { currentuserid, receiveruserid } = req.body
    // console.log(req.body)
    try {
        var currentuser = await User.findOne({ _id: currentuserid })
        var currentUserFollowing = currentuser.following
        const temp1 = currentUserFollowing.filter(obj => obj.toString() !== receiveruserid)


        currentuser.following = temp1

        await User.updateOne({ _id: currentuserid }, currentuser)

        var receiveruser = await User.findOne({ _id: receiveruserid })
        var receiverUserFollowers = receiveruser.followers

        const temp2 = receiverUserFollowers.filter(obj => obj.toString() !== currentuserid)

        receiveruser.followers = temp2

        await User.updateOne({ _id: receiveruserid }, receiveruser)

        res.send('UnFollowed successfully')

    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }

});



//edit profile
router.post("/edit", async (req, res) => {
    try {
        const prevUser = await User.findOne({ _id: req.body._id })
        if (prevUser.profilePicUrl === req.body.profilePicUrl) {
            //update 
            await User.updateOne({ _id: req.body._id }, req.body)
            const user = await User.findOne({ _id: req.body._id })
            res.status(200).send(user)
        } else {
            const uploadResponse = await cloudinary.v2.uploader.upload(req.body.profilePicUrl, {
                folder: "social_images",
                use_filename: true,
            });
            req.body.profilePicUrl = uploadResponse.url
            await User.updateOne({ _id: req.body._id }, req.body)
            //get updated user
            const user = await User.findOne({ _id: req.body._id })
            res.send(user)

        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})




//export this router
//see its diff from model export
//exports not export ***

module.exports = router;
