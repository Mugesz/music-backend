const mongoose = require("mongoose");

const artistSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    imageURL: {
      type: String,
      required: true,
    },
    twitter: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  { timestamps: true }
);
const UserArtist = mongoose.model("artist", artistSchema);

module.exports = UserArtist;
