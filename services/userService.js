const User = require("../models/entities/User");
const Town = require("../models/entities/Town");
const { Role } = require("../models/enums/Role");

const EXISTING_EMAIL =
  "The email address is already registered on this website.";
const EXISTING_USERNAME = "The username is already registered on this website.";
const GENERAL_LOGIN_ERROR = "The username or password is incorrect.";

const NON_EXISTING_TOWN =
  "Your town does not exist in our database. Please try with a bigger city nearby";

async function setRole(user) {
  if ((await User.countDocuments().exec()) === 1) {
    user.role = Role.SUPER_ADMIN.name;
  } else if (user.hasAllOptions) {
    user.role = Role.NORMAL.name;
  } else {
    user.role = Role.LIGHT.name;
  }
}

async function setTown(town, user) {
  let existingTown;
  if (town) {
    const townInsensitiveRegex = new RegExp(`^${town}$`, "i");
    existingTown = await Town.findOne({
      name: { $regex: townInsensitiveRegex },
    });
  }

  if (existingTown) {
    user.town = existingTown;
  } else {
    throw new Error(NON_EXISTING_TOWN);
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
  const existingUserWithEmail = await User.findOne({
    email: email.toLowerCase(),
  }).collation({
    locale: "en",
    strength: 2,
  });

  const existingUserWithUsername = await User.findOne({
    username: { $regex: new RegExp(`^${username.toLowerCase()}$`, "i") },
  });

  if (existingUserWithEmail) {
    throw new Error(EXISTING_EMAIL);
  } else if (existingUserWithUsername) {
    throw new Error(EXISTING_USERNAME);
  }
}

async function getSubUsers(user) {
  return await User.find({
    role: { $in: getLowerRoles(user.role) },
  }).lean();
}

function getLowerRoles(role) {
  const lowerRoles = [];
  for (const instance in Role) {
    const currentRole = Role[instance];
    if (currentRole.index < Role[role].index) {
      lowerRoles.push(currentRole.name);
    }
  }
  return lowerRoles;
}

module.exports = {
  setRole,
  setTown,
  ensureUserExists,
  ensureNewUser,
  getSubUsers,
};
