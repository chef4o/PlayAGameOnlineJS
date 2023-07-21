const fs = require("fs");
const path = require("path");
const Game = require("../models/entities/Game");

async function getAllGames() {
  return await Game.find({}).lean().sort({rating: -1, addedOn: -1});
}

async function getTopFiveByRatingDescAndDateDesc() {
  return await Game.find({}).lean().sort({ rating: -1, addedOn: -1 }).limit(5);
}

async function getGameByName(name) {
  return await Game.findOne({ name: name }).lean();
}

async function addGame(name, genre, description, iconFile, script, css) {
  const newGame = Game.create({
    name,
    genre,
    description,
    addedOn: new Date(),
  });

  try {
    const gameIconPath = path.join(
      __dirname,
      "../static/img/gameIcons",
      `${iconFile.name.toLowerCase()}${path.extname(
        iconFile.name.toLowerCase()
      )}`
    );
    fs.writeFileSync(gameIconPath, iconFile.data);
    console.log(
      `Game icon '${iconFile.name}${path.extname(
        iconFile.name
      )}' saved successfully.`
    );
    newGame.iconFile = iconFile.name;

    const gamePath = path.join(__dirname, "../static/games");
    const scriptFilePath = path.join(gamePath, `${name.toLowerCase()}.js`);
    if (fs.existsSync(scriptFilePath)) {
      throw new Error("Game script file already exists.");
    }
    fs.writeFileSync(scriptFilePath, script.data);
    console.log(`Game file '${name}.js' saved successfully.`);

    const cssPath = path.join(__dirname, "../static/css");
    const cssFilePath = path.join(cssPath, `${name.toLowerCase()}.css`);
    if (fs.existsSync(cssFilePath)) {
      throw new Error("CSS file already exists.");
    }
    fs.writeFileSync(cssFilePath, css.data);
    console.log(`CSS file '${name}.css' saved successfully.`);
  } catch (err) {
    console.error("Error adding game resources:", err);
  }

  return newGame;
}

module.exports = {
  getAllGames,
  getTopFiveByRatingDescAndDateDesc,
  getGameByName,
  addGame,
};
