const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({list: String});
const reviewSchema = new mongoose.Schema({
    resultId: {
        type: mongoose.Schema.Types.ObjectId, required: [true, 'No ID Found'],
        ref: 'results'
    },
    userDetails: {
        browserDetails: {
            name: {
                type: String, required: [true, 'No browser detail found']
            },
            osDetails: {
                type: String, required: [true, 'No os details found']
            },
        },
        botProbability: {
            type: Boolean, required: [true, 'No bot probability found']
        },
        location: {
            timeZone: {
                type: String, required: [true, "No timezone was found"]
            },
            latitude: {
                type: String, required: [true, 'No latitude detail found']
            },
            longitude: {
                type: String, required: [true, 'No latitude detail found']
            },
            country: {
                type: String, required: [true, 'No Country Found']
            },
            city: {
                type: String, required: [true, 'No City Found']
            },
            continent: {
                type: String, required: [true, 'No continent found']
            },
        },
        score: {
            type: Number, required: [true, 'No Number found']
        },
        timeStamp: {
            type: Date, required: [true, 'No timestamp found']
        }
    },
    review: {
        comment: {
            type: String,
        },
        like: Boolean,
        disLike: Boolean
    }
})

const review = mongoose.model("review", reviewSchema);
module.exports = review;