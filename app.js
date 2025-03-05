require("express-async-errors");


const express = require("express");
const errorHandler = require("./middleware/error-handler");
const notFoundHandler = require("./middleware/not-found");

const ratesRouter = require("./routes/rates");
const { port, mongoURI, rateLimitObj } = require("./utils/config");

const app = express();
const connectDB = require("./db/connect");
const path = require("path");

const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./docs/swagger'); 

const swaggerOptions = {
  customCssUrl: '/api-docs/swagger-ui.css', 
  customJs: [
    '/api-docs/swagger-ui-bundle.js',
    '/api-docs/swagger-ui-standalone-preset.js'
  ]
};

const limiter = rateLimit(rateLimitObj);

app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: false, 
  })
);

app.use(limiter);
app.use(cors());
app.use(xss());
app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs, swaggerOptions));
app.use("/api/v1/rates", ratesRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB(mongoURI);

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports = app;
