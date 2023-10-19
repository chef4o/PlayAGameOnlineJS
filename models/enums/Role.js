const Role = {
    LIGHT: { name: "LIGHT", index: 0 },
    NORMAL: { name: "NORMAL", index: 1 },
    MODERATOR: { name: "MODERATOR", index: 2 },
    ADMIN: { name: "ADMIN", index: 3 },
    SUPER_ADMIN: { name: "SUPER_ADMIN", index: 4 }
};

Object.freeze(Role);

const roleNames = Object.values(Role).map(role => role.name);

module.exports = {
    Role, 
    roleNames,
};