require("dotenv").config();

const EXCHANGE_RATE_API = {
  BASE_URL: `https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/latest/USD`,
};

const port = process.env.PORT || 8082;
const mongoURI = process.env.MONGO_URI || "your-default-mongo-uri";

module.exports = { port, mongoURI, EXCHANGE_RATE_API };