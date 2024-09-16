require("dotenv").config();

const seedSpots = require("./spotData.js");
const seedUsers = require("./userData.js");
const seedComments = require("./commentData.js");

const sequelize = require("../config/connection");

const seedDatabase = async () => {
  await sequelize.sync({ force: true });
  
  console.log("\n----- DATABASE SYNCED -----\n");

  await seedUsers();
  console.log("\n----- USERS SEEDED -----\n");

  await seedSpots();
  console.log("\n----- SPOTS SEEDED -----\n");

  await seedComments();
  console.log("\n----- COMMENTS SEEDED -----\n");

  process.exit(0);
};

seedDatabase();
