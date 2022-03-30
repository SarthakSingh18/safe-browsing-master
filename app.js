const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();
app.use(express.json());
const submitReviewRouter = require("./routes/submitReviewRouter");
const pushToQueueRouter = require("./routes/checkURLRouter");
mongoose.connect(process.env.mongodb_host, {
    useNewUrlParser: true,
    maxPoolSize: 10,
});
mongoose.connection.on('connected', () => {
    console.log("mongoose connected");
});
mongoose.connection.on('disconnected', () => {
    console.log("mongoose disconnected");
})
app.use('/submitreview',submitReviewRouter);
app.use('/checkURL', pushToQueueRouter);
module.exports = app;
