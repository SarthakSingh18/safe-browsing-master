const express = require("express");
const router = express.Router();
const middleWare = require("../public/js/middleWare");
const userValidator = require("../public/js/getFingerPrint");
const submitReviewRouter = require("../public/js/submitReview");
const Review = require('../model/reviewModel')

router.post("/", async (req, res) => {
    try {
        if (!req.body.userID || req.body.userID.length > 20) {
            return res.status(400).send({
                success: false,
                message: "request failed",
                "result": {"error": "please provide userID in the body"}
            });
        }

        if (!req.body.resultId) {
            return res.status(400).send({
                success: false,
                message: "request failed",
                result: {
                    error: "please provide resultId in the body"
                }
            });
        }

        let obj = await userValidator.getFingerPrint(req.body.userID);
        console.log(JSON.stringify(obj))
        obj = obj.visits[0]
        //const temp = await submitReviewRouter.saveReviewDatabase(obj);\
        const review = {
            resultId: req.body.resultId,
            userDetails: {
                browserDetails: {
                    name: obj.browserDetails.browserName || '',
                    osDetails: obj.browserDetails.os || ''
                },
                botProbability: obj.browserDetails.botProbability,
                location: {
                    timeZone: obj.ipLocation.timezone,
                    latitude: obj.ipLocation.latitude,
                    longitude: obj.ipLocation.longitude,
                    country: obj.ipLocation.country.name,
                    city: obj.ipLocation.city.name,
                    continent: obj.ipLocation.continent.name
                },
                score: obj.confidence.score,
                timeStamp: obj.timestamp
            },
            review: {
                comment: req.body.comment || '',
                like: req.body.isLiked || true,
                disLike: (typeof req.body.isLiked  == 'boolean' && !req.body.isLiked) || false      // falsy NaN, undefined, false, 0, '',
            }
        }
        await Review.create(review)
        res.send(obj)
    } catch (e) {
        console.log(e);
        res.status(400).send({
            success: false,
            message: "request failed",
            "result": {"error": e}
        });
    }
})

module.exports = router;
