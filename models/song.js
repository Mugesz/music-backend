const mongoose = require("mongoose");

const SongSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    imageURL: {
      type: String,
      required: true,
    },
    songUrl: {
      type: String,
      required: true,
    },
    album: {
      type: String,
    },
    artist: {
      type: String,
      required: true,
    },
    language: {
      type: String,
     
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Song = mongoose.model("Song", SongSchema);

module.exports = Song;