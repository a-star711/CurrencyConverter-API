require("express-async-errors");

const express = require("express");
const errorHandler = require("./middleware/error-handler");
const notFoundHandler = require("./middleware/not-found");

const ratesRouter = require("./routes/rates");
const convertRouter = require("./routes/convert");
const sortingRouter = require("./routes/sortRates");
const { port, mongoURI } = require("./utils/config");

const app = express();
const connectDB = require("./db/connect");

const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

app.set("trust proxy", 1);

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

app.use("/rates", ratesRouter);
app.use("/convert", convertRouter);
app.use("/sort", sortingRouter);

app.get("/", (req, res) => {
  res.send(`
    <h2>Back-end API for Currency Converter</h2>
    <p>Available endpoints:</p>
    <ul>
      <li><a href="/rates">/rates</a> - Get exchange rates (GET)</li>
      <li>/convert - Convert currency (POST request required)  {
      "currency": string,
      "value": number
       }</li>
      <li><a href="/sort">/sort</a> - Sort exchange rates (GET)</li>
    </ul>
    <p>Use a tool like Postman or cURL to send a POST request to <strong>/convert</strong>.</p>
  `);
});

app.use(notFoundHandler);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB(mongoURI);
    // Uncomment to test endpoints on dev

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports = app;
