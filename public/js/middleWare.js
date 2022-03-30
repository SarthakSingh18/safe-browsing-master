const jwt = require("jsonwebtoken");
const isURL = require("is-url");
const https = require('https');
const fs = require("fs");
const trustedCa = [
    '/etc/ssl/certs/ca-certificates.crt'];
require('dotenv').config();

module.exports = {
    checkJWT: (async (req, res, next) => {
        try {
            if (req.headers.authorization != undefined && req.headers.authorization.startsWith("Bearer") && req.headers.authorization.split("")[1]) {
                jwt.verify(req.headers.authorization.split('')[1], process.env.secret, (err, token) => {
                    if (err) {
                        res.status(400).send({
                            success: false,
                            message: "request failed",
                            "result": {"error": "server error"}
                        });
                    } else if (token == undefined) {
                        res.status(400).send({
                            success: false,
                            message: "request failed",
                            "result": {"error": "please provide proper jwt"}
                        });
                    } else {
                        next();
                    }
                })
            }
        } catch (e) {

        }
    }),
    checkURL:(url)=>{
        return new Promise(async(resolve,reject)=>{
            try {
                if (isURL(url)) {
                    const urlObj = new URL(url);
                    console.log(urlObj);
                    if(urlObj.protocol != 'https:'){
                        reject("request is not https in this version we only performs checks on https request");
                    }
                    resolve(urlObj);
                } else {
                    reject("not a URL");
                }
            }
            catch(e){
                console.log(e);
                reject("server error");
            }
        })
    },
    checkCertificate:(host)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                https.globalAgent.options.ca = [];
                for (const ca of trustedCa) {
                    https.globalAgent.options.ca.push(fs.readFileSync(ca));
                }
                options = {
                    host: host,
                    port: 443,
                    path: '/',
                    method: 'GET',
                    rejectUnauthorized:true,
                };
                var req = https.request(options, function(res) {
                    resolve();
                });
                req.end();

                req.on('error', function(e) {
                    if(e.message == "unable to get local issuer certificate" || e.message == "self signed certificate"){
                        console.error(e.message);
                        reject(e.message)
                    }
                    else if(e.message.includes("getaddrinfo ENOTFOUND")){
                        reject("domain not found");
                    }
                });
            }
            catch(e){
                console.log(e);
                reject("some error occured while checking the certificate");
            }
        })
    }
}