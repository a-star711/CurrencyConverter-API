require("express-async-errors");

const express = require("express");
const errorHandler = require("./middleware/error-handler");
const notFoundHandler = require("./middleware/not-found");
const crypto = require("crypto");

const ratesRouter = require("./routes/rates");
const { port, mongoURI, rateLimitObj } = require("./utils/config");

const app = express();
const connectDB = require("./db/connect");

const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./docs/swagger'); 

const swaggerOptions = {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js'
  ]
};


const limiter = rateLimit(rateLimitObj);

app.set("trust proxy", 1);

app.use("/api-docs", (req, res, next) => {
  const send = res.send;
  res.send = html => {
    const injectedHtml = html
      .replace(/<script>/g, `<script nonce="${res.locals.nonce}">`)
      .replace(/<style>/g, `<style nonce="${res.locals.nonce}">`);
    send.call(res, injectedHtml);
  };
  next();
});


app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://cdnjs.cloudflare.com",
          (req, res) => `'nonce-${res.locals.nonce}'`
        ],
        styleSrc: [
          "'self'",
          "https://cdnjs.cloudflare.com",
          "'unsafe-inline'" 
        ],
        imgSrc: ["'self'", "data:", "https://validator.swagger.io"],
        connectSrc: ["'self'"]
      }
    }
  })
);

app.use(limiter);
app.use(cors());
app.use(xss());
app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, swaggerOptions));
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
