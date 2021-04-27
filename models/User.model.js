const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isBusiness: Boolean,

  skiPasses: [{type: Schema.Types.ObjectId, ref: 'Location'}]
});

const User = model("User", userSchema);

module.exports = User;
