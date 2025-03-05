require("express-async-errors");

const express = require("express");
const errorHandler = require("./middleware/error-handler");
const notFoundHandler = require("./middleware/not-found");
const ratesRouter = require("./routes/rates");
const { port, mongoURI, rateLimitObj } = require("./utils/config");

const app = express();
const connectDB = require("./db/connect");

const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./docs/swagger");

// Updated swaggerOptions: we override default assets by adding a nested swaggerOptions property.
// Note: oauth2RedirectUrl isn't available on the server, so it's removed in this example.
const swaggerOptions = {
  customCssUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
  ],
};

const limiter = rateLimit(rateLimitObj);

app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: false, // or configure as needed
  })
);

app.use(limiter);
app.use(cors());
app.use(xss());
app.use(express.json());

app.get("/", (req, res) => {
  res.redirect("/api-docs");
});


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs, swaggerOptions));

app.use("/api-docs", (req, res, next) => {
  const originalSend = res.send;
  res.send = function (html) {
    if (typeof html === "string") {
      const cleanedHtml = html
        .replace(/href="\.\/swagger-ui\.css"/g, '')
        .replace(/src="\.\/swagger-ui-bundle\.js"/g, '')
        .replace(/src="\.\/swagger-ui-standalone-preset\.js"/g, '');
      return originalSend.call(this, cleanedHtml);
    }
    return originalSend.call(this, html);
  };
  next();
});


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
