const { Schema, model, Types: {ObjectId } } = require("mongoose");
const { isEmail, isEmpty } = require("validator");

const roles = require("../enums/roles.json");
const genders = require("../enums/genders.json");

const USERNAME_MIN_LENGTH = 3;
const USERNAME_INVALID_MESSAGE = `Username must be at least ${USERNAME_MIN_LENGTH} characters long.`;
const EMAIL_INVALID_MESSAGE = "The email address must be valid.";
const EMPTY_FIELD = "The field cannot be empty.";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: [USERNAME_MIN_LENGTH, USERNAME_INVALID_MESSAGE],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, EMAIL_INVALID_MESSAGE],
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  town: {
    type: ObjectId,
    ref: "Town",
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: genders,
  },
  avatarPath: {
    type: String,
  },
  role: {
    type: String,
    enum: roles,
    required: true,
  },
});

userSchema.index(
  { username: 1 },
  {
    collection: {
      locale: "en",
      strength: 2,
    },
  }
);

userSchema.virtual("age").get(function () {
  return Math.abs(new Date(Date.now() - this.dateOfBirth).getFullYear - 1970);
});

const User = model("User", userSchema);

module.exports = User;
