const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    feedback: {
        type: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },

    ref: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
