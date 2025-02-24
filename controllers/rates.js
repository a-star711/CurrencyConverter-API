const Usdbase = require("../models/Usdbase");
const { StatusCodes } = require("http-status-codes");
const { EXCHANGE_RATE_API } = require("../utils/constants");

const getRates = async (req, res) => {
  const apiUrl = EXCHANGE_RATE_API.BASE_URL;
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  const existingRates = await Usdbase.findOne({ base_code: "USD" });

  if (existingRates && existingRates.updatedAt > twoHoursAgo) {
    return res.json({
      conversion_rates: existingRates.conversion_rates,
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

  const savedRates = await Usdbase.findOneAndUpdate(
    { base_code: "USD" },
    { conversion_rates: data.conversion_rates, updatedAt: new Date() },
    { upsert: true, new: true }
  );

  res.status(StatusCodes.OK).json(savedRates);
};

module.exports = {
  getRates,
};
