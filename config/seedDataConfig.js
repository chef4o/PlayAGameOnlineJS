const fs = require("fs");
const util = require("util");
const path = require("path");
const readFileAsync = util.promisify(fs.readFile);
const Country = require("../models/entities/Country");
const Game = require("../models/entities/Game");
const Town = require("../models/entities/Town");

const COUNTRIES_LOAD_SUCCESS = "All countries have been loaded successfully.";
const COUNTRIES_DB_EXIXSTS =
  "The Countries table is not empty. Skipping the data import.";
const TOWNS_LOAD_SUCCESS = "All towns have been loaded successfully.";
const TOWNS_DB_EXIXSTS =
  "The Towns table is not empty. Skipping the data import.";
const GAMES_LOAD_SUCCESS = "All Games have been loaded successfully.";
const GAMES_DB_EXIXSTS =
  "The Games table is not empty. Skipping the data import.";

async function seedData(app) {
  await loadCountries();
  await loadTowns();
  await loadGames();
}

async function loadCountries() {
  try {
    if ((await Country.countDocuments()) != 0) {
      console.log(COUNTRIES_DB_EXIXSTS);
      return;
    }

    const countriesFilePath = path.join(
      __dirname,
      "../static/files/db_seed_files/countries.json"
    );
    const countriesData = await readFileAsync(countriesFilePath, "utf8");
    const countries = JSON.parse(countriesData);

    for (const country of countries) {
      const newCountry = new Country({
        code: country.code,
        name: country.name,
        continent: country.continent,
        region: country.region,
        population: country.population,
      });

      await newCountry.save();
    }

    console.log(COUNTRIES_LOAD_SUCCESS);
  } catch (error) {
    console.error(`Error loading countries: ${error}`);
  }
}

async function loadTowns() {
  try {
    if ((await Town.countDocuments()) != 0) {
      console.log(TOWNS_DB_EXIXSTS);
      return;
    }

    const townsFilePath = path.join(
      __dirname,
      "../static/files/db_seed_files/towns.json"
    );
    const townsData = await readFileAsync(townsFilePath, "utf8");
    const towns = JSON.parse(townsData);

    for (const town of towns) {
      const country = await Country.findOne({ name: town.country });

      const newTown = new Town({
        name: town.city,
        country: country._id,
        population: town.population,
        capital: town.capital,
      });

      await newTown.save();
    }

    console.log(TOWNS_LOAD_SUCCESS);
  } catch (error) {
    console.error(`Error loading towns: ${error}`);
  }
}

async function loadGames() {
  try {
    if ((await Game.countDocuments()) != 0) {
      console.log(GAMES_DB_EXIXSTS);
      return;
    }

    const gameFilePath = path.join(
      __dirname,
      "../static/files/db_seed_files/games.json"
    );
    const gameData = await readFileAsync(gameFilePath, "utf8");
    const games = JSON.parse(gameData);

    for (const game of games) {
      const newGame = new Game({
        name: game.name,
        genre: game.genre,
        description: game.description,
        rating: game.rating,
        iconFile: game.iconFile,
        addedOn: game.addedOn,
      });

      await newGame.save();
    }

    console.log(GAMES_LOAD_SUCCESS);
  } catch (error) {
    console.error(`Error loading games: ${error}`);
  }
}

module.exports = seedData;
