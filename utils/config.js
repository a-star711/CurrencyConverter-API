require("dotenv").config();

const port = process.env.PORT || 8082;

const mongoURI = process.env.MONGO_URI;

const rateLimitObj = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
};

const EXCHANGE_RATE_API = {
  BASE_URL: `https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/latest/USD`,
};

module.exports = { port, mongoURI, EXCHANGE_RATE_API, rateLimitObj };
