const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();
const UserAlbum = require("../models/album");
const uri = process.env.DB;

mongoose.connect(uri);

router.post("/save", async (req, res) => {
  const newAlbum = UserAlbum({
    name: req.body.name,
    imageURL: req.body.imageURL,
  
  });
  try {
    const saveAlbum = await newAlbum.save();
    res.status(200).send({ success: true, album: saveAlbum });
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});

router.get("/getOne/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    const data = await UserAlbum.findOne(filter);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(400).json("No artist available");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

router.get("/getAll", async (req, res) => {
  try {
    // const options = {
    //   sort: { createdAt: 1 },

    // };
    const allAlbum = await UserAlbum.find();
    if (allAlbum) {
      res.status(200).send({data:allAlbum});
    } else {
      res.status(400).json({ message: "no artist found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const filter = { _id: id };
  const options = {
    upsert: true,
    new: true,
  };
  try {
    const result = await UserAlbum.findOneAndUpdate(
      filter,
      {
        name: req.body.name,
        imageURL: req.body.imageURL,
      },
      options
    );
    res.status(200).send({ success: true, newAlbum: result });
  } catch (error) {
    res.status(500).send({ success: false, msg: error });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    const result = await UserAlbum.deleteOne(filter);
    if (result.deletedCount === 1) {
      res.status(200).send({ success: true, msg: "Data Deleted" });
    } else {
      res.status(200).send({ success: false, msg: "Data Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

module.exports = router;
