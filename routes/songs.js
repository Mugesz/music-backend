const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();
const Song = require("../models/song");
const uri = process.env.DB;

mongoose.connect(uri);

router.post("/save", async (req, res) => {
  try {
    const newSong = new Song({
      name: req.body.name,
      imageURL: req.body.imageURL,
      songUrl: req.body.songUrl,
      album: req.body.album,
      artist: req.body.artist,
      language: req.body.language,
      category: req.body.category,
    });

    const saveSong = await newSong.save();
    res.status(200).send({ success: true, song: saveSong });
  } catch (error) {
    console.error(error);
    res.status(400).send({ success: false, msg: error.message });
  }
});


router.get("/getOne/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    const data = await Song.findOne(filter);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(400).json("No song available");
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
    const allAlbum = await Song.find();
    if (allAlbum) {
      res.status(200).send({songs:allAlbum});
    } else {
      res.status(400).json({ message: "no song found" });
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
    const result = await Song.findOneAndUpdate(
      filter,
      {
        name: req.body.name,
        imageURL: req.body.imageURL,
        songUrl: req.body.songUrl,
        album: req.body.album,
        artist: req.body.artist,
        language: req.body.language,
        category: req.body.category,
      },
      options
    );
    res.status(200).send({ success: true, newSong: result });
  } catch (error) {
    res.status(500).send({ success: false, msg: error });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    const result = await Song.deleteOne(filter);
    if (result.deletedCount === 1) {
      res.status(200).send({ success: true, msg: "song Deleted" });
    } else {
      res.status(200).send({ success: false, msg: "song Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

module.exports = router;
