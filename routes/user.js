const express = require("express");
const router = express.Router();

const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const fileUpload = require("express-fileupload");
const convertToBase64 = require("../utils/convertToBase64");

const cloudinary = require("cloudinary").v2;
const User = require("../model/User");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/user/signup", fileUpload(), async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if (user) {
      res.status(409).json({message: "Cet email est déjà utiliser"});
    } else {
      if (req.body.email && req.body.password && req.body.username) {
        const token = uid2(64);
        const salt = uid2(64);
        const hash = SHA256(req.body.password + salt).toString(encBase64);

        const newUser = new User({
          email: req.body.email,
          token,
          hash,
          salt,
          account: {username: req.body.username},
        });
        if (req.files?.avatar) {
          const result = await cloudinary.uploader.upload(
            convertToBase64(req.files.avatar),
            {
              folder: `api/Olympia-v2/users/${newUser._id}`,
              public_id: "avatar",
            }
          );
          newUser.account.avatar = result;
        }

        await newUser.save();
        res.status(200).json({
          _id: newUser._id,
          email: newUser.email,
          token: newUser.token,
          account: newUser.account,
        });
      } else {
        res.status(400).json({message: "Missing parametres"});
      }
    }
  } catch (error) {
    res.status(400).json({message: error.message});
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if (user) {
      if (
        SHA256(req.body.password + user.salt).toString(encBase64) === user.hash
      ) {
        res.status(200).json({
          _id: user._id,
          token: user.token,
          account: user.account,
        });
      } else {
        res.status(401).json({error: "Unauthorized"});
      }
    } else {
      res.status(400).json({message: "User not found"});
    }
  } catch (error) {
    console.log(error.message);
    res.json({message: error.message});
  }
});

module.exports = router;
