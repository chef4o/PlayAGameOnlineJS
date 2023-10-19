const { register, login } = require("../services/authService");
const { parseError } = require("../util/parser");
const authController = require("express").Router();
const { SESSION_EXP_TIME_MS } = require("../local/env");

const genders = require("../models/enums/Gender");

const PASSWORDS_MISMATCH = "Passwords do not match";

authController.get("/register", (req, res) => {
  res.render("register", {
    title: "Register with P@GO",
    genders: Object.values(genders),
  });
});

authController.post("/register", async (req, res) => {
  try {
    if (req.body.password != req.body.rePass) {
      throw new Error(PASSWORDS_MISMATCH);
    }

    const token = await register(
      req.body.email,
      req.body.username,
      req.body.password,
      req.body.firstName,
      req.body.lastName,
      req.body.town,
      req.body.dateOfBirth,
      req.body.gender,
      req.body.avatarPath
    );

    res.cookie("token", token, { maxAge: SESSION_EXP_TIME_MS });
    res.redirect("/");
  } catch (error) {

    res.render("register", {
      title: "Register Page",
      body: {
        email: req.body.email,
        username: req.body.username,
        error: parseError(error),
      },
    });
  }
});

authController.get("/login", (req, res) => {
  res.render("login", {
    title: "P@GO Login Page",
  });
});

authController.post("/login", async (req, res) => {
  try {
    const token = await login(req.body.user, req.body.password);

    res.cookie("token", token, { maxAge: SESSION_EXP_TIME_MS });

    res.redirect("/");
  } catch (error) {
    const errors = parseError(error);

    res.render("login", {
      title: "Login Page",
      errors,
      body: {
        user: req.body.user,
      },
    });
  }
});

authController.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = authController;
