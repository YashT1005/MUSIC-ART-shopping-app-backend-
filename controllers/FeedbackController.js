const User = require("../models/User");
const Feedback = require("../models/Feedback")

exports.postFeedback = async (req, res) => {
    try {
        const { type, message } = req.body;

        if (!type || !message) {
            return res.status(400).json({
                success: false,
                message: "Please enter the type and message"
            })
        }

        await Feedback.create({
            feedback: { type: type, message: message },
            ref: req.body.userId,
        });

        return res.status(200).json({
            success: true,
            message: "Feedback submitted successfully",
        });

    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};