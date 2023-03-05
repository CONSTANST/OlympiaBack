const express = require("express");
const router = express.Router();
const createStripe = require("stripe");

const stripe = createStripe(process.env.STRIPE_API_SECRET);

router.post("/payment", async (req, res) => {
  try {
    let {status} = await stripe.charges.create({
      amount: (req.body.amount * 100).toFixed(0),
      currency: "eur",
      description: `Paiement pour :${req.body.title}`,
      source: req.body.token,
    });
    res.json({status});
  } catch (error) {
    console.log(error.message);
    res.status(400).json({error: error.message});
  }
});
module.exports = router;
