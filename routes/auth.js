const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();
const admin = require("../config/firebase.config");
const UserModel = require("../models/user");

const uri = process.env.DB;

mongoose.connect(uri);

router.get("/login", async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(500).send({ message: "Invalid Token" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decodeValue = await admin.auth().verifyIdToken(token);

    if (!decodeValue) {
      return res.status(500).json({ message: "Unauthorized" });
    }

    // Checking if the user exists
    const userExists = await UserModel.findOne({
      user_id: decodeValue.user_id,
    });

    if (!userExists) {
      const newUser = await newUserData(decodeValue);
      return res.status(200).json({ user: newUser });
    } else {
      const updatedUser = await updateUserData(decodeValue);
      return res.status(200).json({ user: updatedUser });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/getUsers", async (req, res) => {
  try {
    const cursor = await UserModel.find();
    if (cursor) {
      res.status(200).send({ success: true, data: cursor });
    } else {
      res.status(400).send({ success: false, msg: "No Data Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

const newUserData = async (decodeValue) => {
  const newUser = new UserModel({
    name: decodeValue.name,
    email: decodeValue.email,
    imageURL: decodeValue.picture,
    user_id: decodeValue.user_id,
    email_verified: decodeValue.email_verified,
    role: "member",
    auth_time: decodeValue.auth_time,
  });

  try {
    const savedUser = await newUser.save();
    return savedUser.toObject(); // Convert Mongoose document to plain JavaScript object
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const updateUserData = async (decodeValue) => {
  const filter = { user_id: decodeValue.user_id };
  const options = {
    upsert: true,
    new: true,
  };

  try {
    const result = await UserModel.findOneAndUpdate(
      filter,
      { auth_time: decodeValue.auth_time },
      options
    );
    return result; // Return the result instead of sending a response
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = router;
