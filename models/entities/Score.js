const { Schema, model, Types: {ObjectId } } = require("mongoose");

const scoreSchema = new Schema({
  value: {
    type: Number,
    required: true,
    default: 0,
  },
  user: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  logTime: {
    type: Date,
    required: true,
  },
  comments: {
    type: [ObjectId],
    default: [],
    ref: "Comment",
  },
});

const Score = model("Score", scoreSchema);

module.exports = Score;
