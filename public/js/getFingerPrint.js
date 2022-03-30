const request = require("request");
require('dotenv').config();
module.exports = {
    getFingerPrint: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                request(`https://ap.api.fpjs.io/visitors/${id}?api_key=${process.env.api_key}`, {json: true}, (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    else if(res.body.visits.length == 0){
                        reject("userID error");
                    }
                    else if(res.body.visits[0].browserDetails.botProbability != 0){
                        reject("user was found bot");
                    }
                    resolve(res.body);
                })
            } catch (e) {
                console.log(e);
                reject("some error occured");
            }
        });
    }
}