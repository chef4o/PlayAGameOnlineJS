const User = require("../models/entities/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../local/env.json");

const EXISTING_EMAIL =
  "The email address is already registered on this website.";
const EXISTING_USERNAME = "The username is already registered on this website.";
const GENERAL_LOGIN_ERROR = "The username or password is incorrect.";

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
  const existingEmail = await User.findOne({ email }).collation({
    locale: "en",
    strength: 2,
  });
  if (existingEmail) {
    throw new Error(EXISTING_EMAIL);
  }

  const existingUsername = await User.findOne({ username }).collation({
    locale: "en",
    strength: 2,
  });
  if (existingUsername) {
    throw new Error(EXISTING_USERNAME);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    username,
    hashedPassword,
    firstName,
    lastName,
    town,
    dateOfBirth,
    gender,
    avatarPath
  });

  return createSession(user);
}

async function login(email, password) {
  const user = await User.findOne({ email }).collation({
    locale: "en",
    strength: 2,
  });

  const match = await bcrypt.compare(password, user.hashedPassword);

  if (!user || !match) {
    throw new Error(GENERAL_LOGIN_ERROR);
  }

  return createSession(user);
}

function createSession({ _id, email, username }) {
  const payload = {
    _id,
    email,
    username,
  };

  const token = jwt.sign(payload, JWT_SECRET);
  return token;
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  register,
  login,
  verifyToken,
};
