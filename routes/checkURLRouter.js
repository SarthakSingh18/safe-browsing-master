const express = require("express");
const router = express.Router();
const pushToQueue = require("../public/js/pushToQueue");
const nsfwDetector = require("../public/js/nsfwDetector");
const urlChecker = require("../public/js/middleWare");
const Result = require('../model/resultModel')

router.post("/", async (req, res) => {
    try {
        if (req.body.url === undefined) {
            throw "please provide url in the body";
        }
        let url = await urlChecker.checkURL(req.body.url);
        if (url.protocol === undefined || url.protocol !== "https:") {
            res.send({"error": "not https"});
            return;
        }
        await urlChecker.checkCertificate(url.host, url.pathname);
        let queueResponse = await pushToQueue.pushURLString(url.host, url.pathname);
        const nsfwResponse = await nsfwDetector.checkNSFW();
        Object.assign(queueResponse, {'nsfw-score': nsfwResponse.output.nsfw_score})
        const a = {
            certificateDetails: queueResponse.ssl_information,
            nsfwPercentage: nsfwResponse.output.nsfw_score,
            screenShot: queueResponse.screenshot_of_webpage,
            redirectResult: {
                url: queueResponse.final_url
            }
        }
        const result = await Result.create(a)
        res.status(200).send({queueResponse, resultId: result._id});
    } catch (e) {
        console.log(e);
        res.status(500).send({"error": e});
    }
})

module.exports = router;
