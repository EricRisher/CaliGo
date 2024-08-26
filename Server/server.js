const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/database");
const userRoutes = require("./routes/user");
const spotRoutes = require("./routes/spots");
const commentRoutes = require("./routes/comments");
const authRoutes = require("./routes/auth");
const helmet = require("helmet");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet()); // Use helmet for security
app.use(express.json());
app.use(cors()); // Allow cross-origin requests

// Use routes
app.use("/api", userRoutes);
app.use("/api", spotRoutes);
app.use("/api", commentRoutes);
app.use("/", authRoutes);

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
