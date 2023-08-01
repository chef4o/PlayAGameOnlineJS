const { Schema, model } = require("mongoose");

const LENGTH = 3;
const COUNTRY_VALIDATION_MESSAGE = `Country must be at least ${LENGTH} characters long.`;
const CONTINENT_VALIDATION_MESSAGE = `Continent must be at least ${LENGTH} characters long.`;
const REGION_VALIDATION_MESSAGE = `Region must be at least ${LENGTH} characters long.`;
const ISO_CODE_VALIDATION_MESSAGE = `ISO Code must be exactly ${LENGTH} characters long.`;

const countrySchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    minLength: [LENGTH, ISO_CODE_VALIDATION_MESSAGE],
    maxLength: [LENGTH, ISO_CODE_VALIDATION_MESSAGE],
  },
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: [LENGTH, COUNTRY_VALIDATION_MESSAGE],
  },
  continent: {
    type: String,
    required: true,
    minLength: [LENGTH, CONTINENT_VALIDATION_MESSAGE],
  },
  region: {
    type: String,
    required: true,
    minLength: [LENGTH, REGION_VALIDATION_MESSAGE],
  },
  population: {
    type: Number,
    required: true,
    min: 1,
  },
});

countrySchema.statics.isEmptySchema = async function () {
  try {
    const count = await this.countDocuments().exec();
    return count === 0;
  } catch (error) {
    throw new Error(
      "Error occurred while checking if Contry collection is empty:",
      error
    );
  }
};

const Country = model("Country", countrySchema);

module.exports = Country;
