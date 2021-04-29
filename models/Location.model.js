const { Schema, model } = require("mongoose");

const locationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  description: String,
  logo: String,
  locPicture: [String],
  website: String,
});

const Location = model("Location", locationSchema);

module.exports = Location;
