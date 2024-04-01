const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
    data: [

    ],
    address: {
        type: String,
        required: true,
    },
    mode: {
        type: String,
        required: true,
    },
    ref: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
