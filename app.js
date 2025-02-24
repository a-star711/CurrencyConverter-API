require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cors = require("cors");
const ratesRouter = require("./routes/rates");
const convertRouter = require("./routes/convert");
const sortingRouter = require("./routes/sortRates");
const errorHandler = require("./middleware/error-handler");
const notFoundHandler = require("./middleware/not-found");

const app = express();
const connectDB = require("./db/connect");

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

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 8082;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    // app.listen(port, () =>
    //   console.log(`Server is listening on port ${port}...`)
    // );
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports = app;
