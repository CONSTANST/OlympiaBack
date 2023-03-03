const express = require("express");
const router = express.Router();
const createStripe = require("stripe");

const stripe = createStripe(process.env.STRIPE_API_SECRET);

router.post("/payment", async (req, res) => {
  try {
  } catch (error) {}
});
