const path = require("path");
const express = require("express");
const session = require("express-session");
const routes = require("./routes");
const helmet = require("helmet");
const cors = require("cors");
require("./models/Index.js"); // Ensure the correct relative path

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Session configuration
const sess = {
  secret: "KittyMeowKat",
  cookie: {
    maxAge: 3600000, // 1 hour session duration
    httpOnly: false,
    secure: false,
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// Middleware
app.use(session(sess)); // Initialize session middleware
app.use(helmet()); // Use helmet for security
app.use(express.json());
app.use(cors()); // Allow cross-origin requests
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(routes);

// Start server and sync database
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () =>
    console.log(`Now listening on http://localhost:${PORT}`)
  );
});
