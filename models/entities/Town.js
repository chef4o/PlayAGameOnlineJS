const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

const MIN_LENGTH = 2;
const TOWN_VALIDATION_MESSAGE = `Town must be at least ${MIN_LENGTH} characters long.`;

const townSchema = new Schema(
  {
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
  },
  { collation: { locale: "en", strength: 2 } }
);

townSchema.statics.isEmptySchema = async function () {
  try {
    const count = await this.countDocuments().exec();
    return count === 0;
  } catch (error) {
    throw new Error(
      "Error occurred while checking if Town collection is empty:",
      error
    );
  }
};

const Town = model("Town", townSchema);

module.exports = Town;
