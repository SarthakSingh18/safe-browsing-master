const reviewModel = require("../../model/reviewModel");
module.exports = {
    saveReviewDatabase:(obj)=>{
        return new Promise(async(resolve,reject)=>{
            const review = new reviewModel({
                "resultID":"12121212"
            })
            review.save((err)=>{
                if(err){
                    console.log(err);
                    reject("error");
                }
                else console.log("temp");
                resolve("Successfully");
            })
        })
    }
}