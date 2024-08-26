const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/database");
const userRoutes = require("./routes/user");
const spotRoutes = require("./routes/spots");
const commentRoutes = require("./routes/comments");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Use the combined routes and controllers
app.use("/api", userRoutes);
app.use("/api", spotRoutes);
app.use("/api", commentRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
    return sequelize.sync();
  })
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
