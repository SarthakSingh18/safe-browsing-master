const express = require("express");
const router = express.Router();
const middleWare = require("../public/js/middleWare");
const userValidator = require("../public/js/getFingerPrint");
const submitReviewRouter = require("../public/js/submitReview");
router.post("/",async (req, res) => {
    try {
        if (!req.body.userID || req.body.userID.length > 20) {
            res.status(400).send({
                success: false,
                message: "request failed",
                "result": {"error": "please provide userID in the body"}
            });
        } else {
            const obj = await userValidator.getFingerPrint(req.body.userID);
            //const temp = await submitReviewRouter.saveReviewDatabase(obj);
            res.send(obj)
        }
    }
    catch(e){
        console.log(e);
        res.status(400).send({
            success: false,
            message: "request failed",
            "result": {"error": e}
        });
    }
})

module.exports = router;
