const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();
const UserArtist = require("../models/artist");
const uri = process.env.DB;

mongoose.connect(uri);

router.post("/save", async (req, res) => {
  const newArtist = UserArtist({
    name: req.body.name,
    imageURL: req.body.imageURL,
    twitter: req.body.twitter,
    instagram: req.body.instagram,
  });
  try {
    const saveArtist = await newArtist.save();
    res.status(200).send({UserArtist:saveArtist});
  } catch (error) {
    res.status(400).send({ success: false, msg: error });
  }
});

router.get("/getOne/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    const data = await UserArtist.findOne(filter);
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

    const allArtist = await UserArtist.find();
    if (allArtist) {
      res.status(200).send({data:allArtist});
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
    const result = await UserArtist.findOneAndUpdate(
      filter,
      {
        name: req.body.name,
        imageURL: req.body.imageURL,
        twitter: req.body.twitter,
        instagram: req.body.instagram,
      },
      options
    );
    res.status(200).send({ success: true, newArtist: result });
  } catch (error) {
    res.status(500).send({ success: false, msg: error });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    const result = await UserArtist.deleteOne(filter);
    if (result.deletedCount === 1) {
      res.status(200).send({ success: true, msg: "artist Deleted" });
    } else {
      res.status(200).send({ success: false, msg: "artist Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

module.exports = router;