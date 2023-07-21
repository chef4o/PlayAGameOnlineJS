const { Schema, model, Types: {ObjectId } } = require("mongoose");

const MIN_LENGTH = 2;
const TOWN_VALIDATION_MESSAGE = `Town must be at least ${MIN_LENGTH} characters long.`;

const townSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: [MIN_LENGTH, TOWN_VALIDATION_MESSAGE],
  },
  country: {
    type: ObjectId,
    required: true,
    ref: "Country",
  },
  population: {
    type: Number,
    required: true,
    min: 1,
  },
  capital: {
    type: Boolean,
    required: true,
  },
});

const Town = model("Town", townSchema);

module.exports = Town;
