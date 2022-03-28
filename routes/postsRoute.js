const express = require("express");
const router = express.Router();
const { cloudinary } = require("../cloudinary");
const moment = require("moment")
const Post = require("../models/postModel");

router.post("/addpost", async (req, res) => {
  try {
    //cloudinary syntax
    //v2 = version 2
    const uploadResponse = await cloudinary.v2.uploader.upload(req.body.image, {
      folder: "social_images",
      use_filename: true,
    });
    //after storing in clodinary it gives us image url so we need need save this url in mongoDB
    req.body.image = uploadResponse.url;
    const newPost = new Post(req.body);
    //if success
    await newPost.save();
    res.send("Post added Successfully!!!");
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

//edit post
router.post("/editpost", async (req, res) => {
  try {

    await Post.updateOne({ _id: req.body._id }, req.body)

    res.send("Post updated Successfully!!!");
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});
//get all the images in home.
router.get("/getallposts", async (req, res) => {

  try {
    //find all posts
    const posts = await Post.find().populate('user').sort({ createdAt: -1 }).exec();
    res.status(200).send(posts);

    //populate => also give user details
  } catch (error) {
    console.log(error);
    return res.status(500).json(error)
  }

})

//like/unlike

router.post("/likeorunlikepost", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.body.postid })
    var likes = post.likes

    //check if user already liked post or not
    if (likes.find(obj => obj.user == req.body.userid)) {
      //remove like
      const temp = likes.filter(obj => obj.user.toString() !== req.body.userid)
      post.likes = temp
      await Post.updateOne({ _id: req.body.postid }, post);
      res.status(200).send("Post Unliked Successfully")
    } else {
      likes.push({ user: req.body.userid, date: moment().format("MMM DD yyyy") })

      post.likes = likes
      await Post.updateOne({ _id: req.body.postid }, post);
      res.status(200).send("Post liked Successfully")
    }

  } catch (error) {
    console.log(error)
    res.status(500).send(error)

  }
})

//comments
router.post("/addcomment", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.body.postid })
    var comments = post.comments
    //comment/userid/postid
    comments.push({ user: req.body.userid, date: moment().format("MMM DD yyyy"), comment: req.body.comment })
    //assign comments to actual post
    post.comments = comments;

    await Post.updateOne({ _id: req.body.postid }, post);
    res.status(200).send("Commented Successfully")


  } catch (error) {
    console.log(error)
    res.status(500).send(error)

  }
})




//delete
router.post("/deletepost", async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.body?._id })
    res.send("post deleted successfully!!")
  } catch (error) {
    return res.status(400).json(error)
  }
})
module.exports = router;
