const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product', 
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true, 
            min: 1 
        },
        price: { 
            type: Number, 
            required: true, 
            min: 0 // Ensures price is a positive value
        }
    }],
    total: { 
        type: Number, 
        default: 0 
    }
});

// Make sure to call the schema method whenever you want to recalculate the total
CartSchema.methods.calculateTotal = function() {
    this.total = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    return this.total;
};

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
