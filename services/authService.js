const User = require("../models/entities/User");
const {
  setRole,
  setTown,
  ensureUserExists,
  ensureNewUser,
} = require("./userService");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TKN } = require("../local/env.json");
const validator = require("validator");

const MISSING_MANDATORY_FIELDS_DATA = "All fields are required";
const INVALID_EMAIL = "Email address is invalid";
const DEFAULT_REG_YEAR = "1900-01-01";

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

  const user = await User.findOne({
    $regex: new RegExp(`^${loginName.toLowerCase()}$`, "i"),
  });

  const match = await bcrypt.compare(password, user.hashedPassword);

  ensureUserExists(user, loginName, match);
  return createSession(user);
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
    hasAdminRights: user.hasAdminRights,
  };

  return jwt.sign(payload, TKN, {
      expiresIn: "1h",
    });
}

function verifyToken(token) {
  return jwt.verify(token, TKN);
}

module.exports = {
  register,
  login,
  verifyToken,
};
