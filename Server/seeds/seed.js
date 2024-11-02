const sequelize = require("../config/connection");

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    process.exit(0);
  }
};

seedDatabase();
