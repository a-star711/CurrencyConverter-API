const express = require("express");
const router = express.Router();

const {
  getRates,
  convertRates,
  calcSortedRates,
} = require("../controllers/rates");

/**
 * @swagger
 * /api/v1/rates:
 *   get:
 *     summary: Get exchange rates
 *     description: Fetch the latest exchange rates from the database or external API.
 *     responses:
 *       "200":
 *         description: Successful response with exchange rates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conversion_rates:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *                 cached:
 *                   type: boolean
 *       "400":
 *         description: Bad request
 *       "404":
 *         description: Rates not found
 */
router.route("/").get(getRates);

/**
 * @swagger
 * /api/v1/rates/sort:
 *   get:
 *     summary: Get sorted exchange rates
 *     description: Fetch exchange rates sorted in ascending order.
 *     responses:
 *       "200":
 *         description: Successful response with sorted exchange rates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conversion_rates:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *       "404":
 *         description: Rates not found
 */
router.route("/sort").get(calcSortedRates);

/**
 * @swagger
 * /api/v1/rates/convert:
 *   post:
 *     summary: Convert currency
 *     description: Convert an amount from one currency to others based on exchange rates.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currency
 *               - value
 *             properties:
 *               currency:
 *                 type: string
 *                 example: EUR
 *               value:
 *                 type: number
 *                 example: 100
 *     responses:
 *       "200":
 *         description: Successful conversion response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rates:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *       "400":
 *         description: Invalid request parameters
 *       "404":
 *         description: Rates not found in the database
 */
router.route("/convert").post(convertRates);

module.exports = router;
