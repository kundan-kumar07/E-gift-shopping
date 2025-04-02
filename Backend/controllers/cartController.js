const Cart = require('../models/Cart');

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity, price } = req.body;
        const userId = req.user.id; // Extracted from JWT

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if product already exists in cart
        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity, price });
        }

        // Recalculate total price
        cart.total = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

        await cart.save();
        res.json({ message: 'Item added to cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// View cart
exports.viewCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');

        if (!cart || cart.items.length === 0) {
            return res.json({ message: 'Your cart is empty', items: [] });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        cart.total = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
        await cart.save();

        res.json({ message: 'Item removed from cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ userId: req.user.id });
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
