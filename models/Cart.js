const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    cart: [
        {
            productId: {
                type: mongoose.Types.ObjectId,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            }
        },
    ],
    ref: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
});

module.exports = mongoose.model("Cart", cartSchema);
