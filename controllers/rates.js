const Usdbase = require("../models/Usdbase");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const { EXCHANGE_RATE_API } = require("../utils/config");

const convertRates = async (req, res) => {
  const { currency, value } = req.body;

  if (!currency || value === undefined || value === null || isNaN(value)) {
    throw new BadRequestError("Currency and value are required");
  }

  const ratesData = await Usdbase.findOne({ base_code: "USD" });

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



const getRates = async (req, res) => {
  const apiUrl = EXCHANGE_RATE_API.BASE_URL;
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  const rates = await Usdbase.findOne({ base_code: "USD" });

  if (rates && rates.updatedAt > twoHoursAgo) {
    return res.json({
      conversion_rates: rates.conversion_rates,
      cached: true,
    });
  }

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new BadRequestError(
      `Failed to fetch rates. Status: ${response.statusText}`
    );
  }
  const data = await response.json();

  const latestRates = await Usdbase.findOneAndUpdate(
    { base_code: "USD" },
    { conversion_rates: data.conversion_rates, updatedAt: new Date() },
    { upsert: true, new: true }
  );

  res.status(StatusCodes.OK).json(latestRates);
};



const calcSortedRates = async (req, res) => {
  const rates = await Usdbase.findOne({ base_code: "USD" });

  if (!rates) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Rates not found" });
  }

  const ratesObject = rates.conversion_rates;

  const sortedRates = Object.fromEntries(
    Object.entries(ratesObject).sort(([, a], [, b]) => a - b)
  );

  res.status(StatusCodes.OK).json({ conversion_rates: sortedRates });
};

module.exports = {
  calcSortedRates,
  getRates,
  convertRates
};