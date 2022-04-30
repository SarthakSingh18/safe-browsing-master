const mongoose = require("mongoose");
const resultSchema = new mongoose.Schema({
    certificateDetails: String,
    nsfwPercentage: Number,
    screenShot: String,
    redirectResult: {
        url: String,
    }
});

const result = mongoose.model("result", resultSchema);
module.exports = result;


