const express = require("express");
const router = express.Router();
const pushToQueue = require("../public/js/pushToQueue");
const nsfwDetector = require("../public/js/nsfwDetector");
const urlChecker = require("../public/js/middleWare");
router.post("/",async (req,res)=>{
    try{
        if(req.body.url == undefined){
            throw "please provide url in the body";
        }
        let url = await urlChecker.checkURL(req.body.url);
        if(url.protocol== undefined || url.protocol != "https:"){
            res.send({"error":"not https"});
            return;
        }
        const certificateResponse = await urlChecker.checkCertificate(url.host);
        let queueResponse = await pushToQueue.pushURLString(url.host);
        const nsfwResponse = await nsfwDetector.checkNSFW();
        Object.assign(queueResponse,{'nsfw-score':nsfwResponse.output.nsfw_score})
        res.status(200).send({queueResponse});
    }   catch(e){
        console.log(e);
        res.status(500).send({"error":e});
    }
})

module.exports = router;
