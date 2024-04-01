require("dotenv").config();
const express = require('express')
const mongoose = require("mongoose");
const cors = require("cors");
const app = express()
const port = process.env.PORT || 4000

app.use(express.json());
app.use(cors());

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Database Connected"))
    .catch((error) => console.log("Failed to connect", error));

// health Api
app.get("/run", (req, res) => {
    res.json({
        service: "Music Art App",
        status: "Active",
        time: new Date(),
    });
});

//importing Routes
const user = require('./routes/UserRoutes');
const cart = require('./routes/CartRoutes')
const feedback = require('./routes/FeedbackRoutes')

//Using routes
app.use('/api/v1', user)
app.use('/api/v1', cart)
app.use('/api/v1', feedback)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})