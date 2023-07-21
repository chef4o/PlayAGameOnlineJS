const { Schema, model, Types: {ObjectId } } = require("mongoose");

const genres = require("../enums/genres.json");

const LENGTH = 2;
const NAME_VALIDATION_MESSAGE = `Game name must be at least ${LENGTH} characters long.`;

const gameSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    minLength: [LENGTH, NAME_VALIDATION_MESSAGE],
  },
  genre: {
    type: String,
    enum: genres,
  },
  description: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
  },
  iconFile: {
    type: String,
    required: true,
  },
  addedOn: {
    type: Date,
    required: true,
  },
  likedBy: {
    type: [ObjectId],
    default: [],
    ref: "User",
  },
  scores: {
    type: [ObjectId],
    default: [],
    ref: "Score",
  },
  comments: {
    type: [ObjectId],
    default: [],
    ref: "Comment",
  },
});

const Game = model("Game", gameSchema);

module.exports = Game;
