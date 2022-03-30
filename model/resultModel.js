const mongoose = require("mongoose");
const resultSchema = new mongoose.Schema({
    certificateValid: Boolean,
    certificateDetails: String,
    nsfwPercentage: Number,
    screenShot: String,
    redirectResult: {
        url: String,
        cookiesCount: Number
    }
});

const result = mongoose.model("resultSchema", resultSchema);
module.exports = result;


