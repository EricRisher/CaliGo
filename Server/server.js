require("dotenv").config();
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const sequelize = require("./config/connection");
const { addListener } = require("process");

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Optional: Helmet Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "trusted-cdn.com"],
      "style-src": ["'self'", "'unsafe-inline'"],
    },
  })
);

// CORS configuration
const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:3000",
  "http://192.168.1.37:3000",
  "http://192.168.1.37:3001",
  "http://caligo.site",
  "https://caligo.site",
  "http://www.caligo.site",
  "https://www.caligo.site",
  "https://pagead2.googlesyndication.com",
  "https://maps.googleapis.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials (cookies)
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  })
);

// Preflight requests for all routes
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static asset serving
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check route
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Custom routes
app.use(routes);

// Error handling for server and CORS
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  if (err.message.includes("CORS")) {
    res.status(403).json({ error: "CORS policy blocked this request." });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server and sync database
sequelize.sync({ force: false , alter: true}).then(() => {
  app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
  );
});
