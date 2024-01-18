const mongoose = require("mongoose");

const albumSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    imageURL: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserAlbum = mongoose.model("album", albumSchema);

module.exports = UserAlbum;