require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const ratesRouter = require('./routes/rates');
const convertRouter = require('./routes/convert')
const sortingRouter = require('./routes/sortRates')
const errorHandler = require('./middleware/error-handler')
const notFoundHandler = require('./middleware/not-found')

const app = express();
const connectDB = require('./db/connect');

app.use(cors()); 
app.use(express.json())


app.use('/rates', ratesRouter);
app.use('/convert', convertRouter);
app.use('/sort', sortingRouter);

app.use(notFoundHandler)
app.use(errorHandler);

const port = process.env.PORT || 8082;
const start = async () => {
  try {

    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    ); 
  } catch (error) {
    console.log(error);
  }
};

start();


module.exports = app;