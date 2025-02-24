const Usdbase = require("../models/Usdbase");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const convertRates = async (req, res) => {
  const { currency, value } = req.body;

  if (!currency || value === undefined || value === null || isNaN(value)) {
    throw new BadRequestError("Currency and value are required");
  }

  const ratesData = await Usdbase.findOne({ base_code: "USD" }).lean();

  if (!ratesData) {
    throw new NotFoundError("Rates not found in the database");
  }

  const rates = ratesData.conversion_rates;

  if (!rates[currency]) {
    throw new BadRequestError(`Currency ${currency} not found in rates`);
  }

  const baseValue = value / rates[currency];
  const convertedRates = Object.keys(rates).reduce((acc, curr) => {
    acc[curr] = parseFloat((baseValue * rates[curr]).toFixed(4));
    return acc;
  }, {});

  res.status(StatusCodes.OK).json({ rates: convertedRates });
};
module.exports = {
  convertRates,
};
