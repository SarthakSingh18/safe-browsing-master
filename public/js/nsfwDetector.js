const fs = require('fs');
const deepai = require('deepai');
deepai.setApiKey('55e0ffcb-ee36-4305-b782-1a3620d28f50');
module.exports = {
    checkNSFW:()=>{
        return new Promise(async(resolve,reject)=>{
            try{
                await (async function () {
                    let resp = await deepai.callStandardApi("nsfw-detector", {
                        image: fs.createReadStream("/home/sarthak/WebstormProjects/safe-browsing-screenshot/screenshot.png"),
                    });
                    console.log(resp);
                    resolve(resp);
                })()
            }catch(e){
                console.log(e);
                reject("some error occured")
            }
        })
    }
}