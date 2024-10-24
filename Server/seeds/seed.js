require("dotenv").config();

const seedSpots = require("./spotData.js");
const seedUsers = require("./userData.js");
const seedComments = require("./commentData.js");
const seedLikes = require("./likeData.js");

const sequelize = require("../config/connection");
sequelize.options.logging = console.log;

const seedDatabase = async () => {
  await sequelize.sync({ force: false });
  console.log("\n----- DATABASE SYNCED -----\n");

  await seedUsers();
  console.log("\n----- USERS SEEDED -----\n");

  await seedSpots();
  console.log("\n----- SPOTS SEEDED -----\n");

  await seedLikes();
  console.log("\n----- LIKES SEEDED -----\n");

  await seedComments();
  console.log("\n----- COMMENTS SEEDED -----\n");

  process.exit(0);
};

seedDatabase();
