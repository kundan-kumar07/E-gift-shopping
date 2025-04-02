const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");

router.post("/", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, products: [] });
  }
  cart.products.push({ productId, quantity });
  await cart.save();
  res.json({ message: "Added to cart" });
});

router.get("/:userId", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId }).populate("products.productId");
  res.json(cart);
});

module.exports = router;