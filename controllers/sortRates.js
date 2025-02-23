const Usdbase = require("../models/Usdbase");
const { StatusCodes } = require("http-status-codes");

const getSortedRates = async (req, res) => {
  const existingRates = await Usdbase.findOne({ base_code: "USD" });

  if (!existingRates) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Rates not found" });
  }

  const ratesObject = existingRates.conversion_rates;

  const sortedRates = Object.fromEntries(
    Object.entries(ratesObject).sort(([, a], [, b]) => a - b)
  );

  res.status(StatusCodes.OK).json({ conversion_rates: sortedRates });
};

module.exports = {
  getSortedRates,
};
