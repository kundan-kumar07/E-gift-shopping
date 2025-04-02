const express = require('express');
const Cart = require('../models/Cart');
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware
const router = express.Router();

// Add item to cart
router.post('/cart', authMiddleware, async (req, res) => {
    const { productId, quantity, price } = req.body;
    const userId = req.user.id;  // Assuming userId comes from the token in authMiddleware

    // Validation
    if (!productId || !quantity || !price) {
        return res.status(400).json({ message: 'Missing required fields (productId, quantity, price)' });
    }

    try {
        let cart = await Cart.findOne({ userId });

        // If cart doesn't exist, create a new one
        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, quantity, price }]
            });
        } else {
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());

            // If item is not already in the cart, add it
            if (itemIndex === -1) {
                cart.items.push({ productId, quantity, price });
            } else {
                // If item exists, update its quantity
                cart.items[itemIndex].quantity += quantity;
            }
        }

        // Recalculate total price of the cart
        cart.total = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Save the cart
        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
