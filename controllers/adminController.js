const User = require("../models/entities/User");
const { Role } = require("../models/enums/Role");
const { getSubUsers } = require("../services/userService");

const adminController = require("express").Router();

adminController.get("/", async (req, res) => {
  if (req.user && req.user.hasAdminRights) {
    const subUsers = await getSubUsers(req.user);

    res.render("adminPanel", {
      title: "P@GO Admin Panel",
      user: req.user,
      subUsers: subUsers,
    });
  } else {
    res.render("403", {
      title: "P@GO Access denied",
      user: req.user,
    });
  }
});

adminController.get("/edit/:id", async (req, res) => {
  if (req.user && req.user.hasAdminRights) {
    let currentUserRole;
    const subUsers = await getSubUsers(req.user);
    subUsers.forEach((u) => {
      if (u._id == req.params.id) {
        u.toEdit = true;
        currentUserRole = u.role;
      }
    });

    let currentRoles = Role;
    Object.values(currentRoles).forEach((r) => {
      if (r.name == currentUserRole) {
        r.isCurrent = true;
      } else {
        r.isCurrent = false;
      }
    });
    const currentRolesArray = Object.values(currentRoles);

    res.render("adminPanel", {
      title: "P@GO Admin user edit",
      user: req.user,
      currentRolesArray: currentRolesArray,
      subUsers: subUsers,
    });
  } else {
    res.render("403", {
      title: "P@GO Access denied",
      user: req.user,
    });
  }
});

module.exports = adminController;
