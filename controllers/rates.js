const Usdbase = require("../models/Usdbase");
const { StatusCodes } = require("http-status-codes");

const apiUrl = `https://v6.exchangerate-api.com/v6/${process.env.API_KEY}/latest/USD`;
const now = new Date();
const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

const getRates = async (req, res) => {
  const existingRates = await Usdbase.findOne({ base_code: "USD" });

  console.log('Existing rates', existingRates)

  if (existingRates && existingRates.updatedAt > twoHoursAgo) {
    console.log('existingRates2')

    return res.json({
      conversion_rates: existingRates.conversion_rates,
      cached: true,
    });
  }

  const response = await fetch(apiUrl);

  console.log('Response', response)


  if (!response.ok) {
    throw new BadRequestError(
      `Failed to fetch rates. Status: ${response.statusText}`
    );
  }
  const data = await response.json();


  console.log('dataaa', data)

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
