const { Schema, model, Types: {ObjectId } } = require("mongoose");

const reactionSchema = new Schema({
  isLike: {
    type: Boolean,
    required: true,
  },
  owner: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
});

const Reaction = model("Reaction", reactionSchema);

module.exports = Reaction;
