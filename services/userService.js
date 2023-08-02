const User = require("../models/entities/User");
const Town = require("../models/entities/Town");
const Role = require("../models/enums/Role");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TKN } = require("../local/env.json");
const validator = require("validator");

const EXISTING_EMAIL =
  "The email address is already registered on this website.";
const EXISTING_USERNAME = "The username is already registered on this website.";
const GENERAL_LOGIN_ERROR = "The username or password is incorrect.";
const MISSING_MANDATORY_FIELDS_DATA = "All fields are required";
const INVALID_EMAIL = "Email address is invalid";
const DEFAULT_REG_YEAR = "1900-01-01";
const NON_EXISTING_TOWN =
  "Your town does not exist in our database. Please try with a bigger city nearby";

async function register(
  email,
  username,
  password,
  firstName,
  lastName,
  town,
  dateOfBirth,
  gender,
  avatarPath
) {
  validateFields(email, username, password, firstName);

  dateOfBirth == DEFAULT_REG_YEAR ? null : new Date(dateOfBirth);

  await ensureNewUser(email, username);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    username,
    hashedPassword,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    avatarPath,
  });

  await setRole(user);
  await setTown(town, user);
  user.save();

  return createSession({ email, username });
}

async function login(loginName, password) {
  validateFields(loginName, password);

  const user = await User.findOne({ loginName }).collation({
    locale: "en",
    strength: 2,
  });

  const match = await bcrypt.compare(password, user.hashedPassword);

  ensureUserExists(user, loginName, match);
  return createSession(user);
}

async function setRole(user) {
  if (await User.countDocuments().exec() === 1) {
    user.role = Role.SUPER_ADMIN;
  } else if (user.hasAllOptions) {
    user.role = Role.NORMAL;
  } else {
    user.role = Role.LIGHT;
  }
}

async function setTown(town, user) {
  let existingTown;
  if (town) {
    const townInsensitiveRegex = new RegExp(`^${town}$`, 'i');
    existingTown = await Town.findOne({
      name: { $regex: townInsensitiveRegex },
    });
  }

  if(existingTown) {
    user.town = existingTown;
  }
}

function ensureUserExists(user, loginName, match) {
  if (
    !user ||
    !match ||
    (user.email.toLowerCase() != loginName.toLowerCase() &&
      user.username.toLowerCase() != loginName.toLowerCase())
  ) {
    throw new Error(GENERAL_LOGIN_ERROR);
  }
}

async function ensureNewUser(email, username) {
  const lowercasedEmail = email.toLowerCase();
  const lowercasedUsername = username.toLowerCase();

  const existingUserWithEmail = await User.findOne({
    email: lowercasedEmail,
  }).collation({
    locale: "en",
    strength: 2,
  });

  const existingUserWithUsername = await User.findOne({
    username: { $regex: new RegExp(`^${lowercasedUsername}$`, "i") }, // Case-insensitive regex search
  });

  if (existingUserWithEmail) {
    throw new Error(EXISTING_EMAIL);
  } else if (existingUserWithUsername) {
    throw new Error(EXISTING_USERNAME);
  }
}

function validateFields(...params) {
  params.forEach((param) => {
    const paramName = Object.keys(param)[0];
    const paramValue = param[paramName];

    if (
      !paramValue ||
      (typeof paramValue === "string" && paramValue.trim() === "")
    ) {
      console.log(`Parameter "${paramName}" is empty or not a string.`);
      throw new Error(MISSING_MANDATORY_FIELDS_DATA);
    }

    if (paramName === "email" && validator.isEmail(email) == false) {
      throw new Error(INVALID_EMAIL);
    }
  });
}

function createSession(user) {
  const payload = {
    email: user.email,
    username: user.username,
  };

  return jwt.sign(payload, TKN);
}

function verifyToken(token) {
  return jwt.verify(token, TKN);
}

module.exports = {
  register,
  login,
  verifyToken,
};
