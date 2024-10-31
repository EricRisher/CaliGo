require("dotenv").config();
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Add this for handling cookies
const routes = require("./routes");

const sequelize = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Use helmet for security

// Helmet Content Security Policy (optional, but enhances security)
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "trusted-cdn.com"],
      "style-src": ["'self'", "'unsafe-inline'"],
    },
  })
);

// CORS configuration (Limit origins for better security)
const allowedOrigins = ["http://localhost:3001", "http://localhost:3000"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parses cookies

// Serve static assets
app.use(express.static(path.join(__dirname, "public")));

app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// Routes
app.use(routes);

app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server and sync database
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () =>
    console.log(`Now listening on http://localhost:${PORT}`)
  );
});
