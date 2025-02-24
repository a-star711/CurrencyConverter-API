const Usdbase = require("../models/Usdbase");
const { StatusCodes } = require("http-status-codes");

const getSortedRates = async (req, res) => {
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
  getSortedRates,
};
