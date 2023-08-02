const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");
const { isEmail } = require("validator");

const Role = require("../enums/Role");
const Gender = require("../enums/Gender");

const USERNAME_MIN_LENGTH = 3;
const USERNAME_INVALID_MESSAGE = `Username must be at least ${USERNAME_MIN_LENGTH} characters long.`;
const EMAIL_INVALID_MESSAGE = "The email address must be valid.";

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
    enum: Object.values(Gender),
  },
  avatarPath: {
    type: String,
  },
  role: {
    type: String,
    enum: Object.values(Role),
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

userSchema.virtual("hasAllOptions").get(function () {
  return (
    this.gender && this.gender.toUpperCase() != Gender.NONE &&
    this.dateOfBirth && this.dateOfBirth != this.defaultDob &&
    this.town
  );
});

userSchema.virtual("defaultDob").get(function () {
  return new Date("1900-01-01");
});

userSchema.statics.isEmptySchema = async function () {
  try {
    const count = await this.countDocuments().exec();
    return count === 0;
  } catch (error) {
    throw new Error('Error occurred while checking if User collection is empty:', error);
  }
};

const User = model("User", userSchema);

module.exports = User;
