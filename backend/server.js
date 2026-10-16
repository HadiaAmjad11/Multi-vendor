const path = require("path");
const dotenv = require("dotenv");

// Load .env FIRST
const envPath = path.join(__dirname, "config", ".env");

dotenv.config({
  path: envPath,
});

console.log("DB_URL loaded:", !!process.env.DB_URL);

const app = require("./app");
const connectDatabase = require("./db/Database");

const PORT = process.env.PORT || 8000;

// Connect MongoDB AFTER dotenv
connectDatabase();

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (err) => {
  console.error("Server error:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});