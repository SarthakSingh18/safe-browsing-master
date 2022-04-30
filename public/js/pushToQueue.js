const amqp = require('amqplib/callback_api');
module.exports = {
    pushURLString: (urlHost, urlPath) => { //to be changed
        return new Promise(async (resolve, reject) => {
            try {
                //console.log("i am here");
                amqp.connect('amqp://localhost', function (error0, connection) {
                    if (error0) {
                        throw error0;
                    }
                    connection.createChannel(function (error1, channel) {
                        if (error1) {
                            console.log(error1);
                            throw error1;
                        }
                        channel.assertQueue('', {
                            exclusive: true
                        }, function (error2, q) {
                            if (error2) {
                                throw error2;
                            }
                            var exchange = 'logs';

                            channel.assertExchange(exchange, 'fanout', {
                                durable: false
                            });
                            let obj = {};
                            let correlationId = generateUuid();
                            console.log(correlationId);
                            channel.publish(exchange, '', Buffer.from(urlHost.toString() + " " + urlPath.toString()), {
                                correlationId: correlationId, replyTo: q.queue
                            });
                            console.log(" [x] Sent %s", urlHost, urlPath);
                            let i = 0;
                            channel.consume(q.queue, function (msg) {
                                if (msg.properties.correlationId === correlationId) {
                                    i++;
                                    switch (msg.properties.headers.msgFrom) {
                                        case 'check-ssl':
                                            Object.assign(obj, {'ssl_information': msg.content.toString()})
                                            break;
                                        case 'check-redirect':
                                            Object.assign(obj, {'final_url': msg.content.toString()})
                                            break;
                                        case 'click-screenShot':
                                            Object.assign(obj, {'screenshot_of_webpage': msg.content.toString()})
                                            break;
                                    }
                                    if (i === 3) {
                                        console.log(obj);
                                        resolve(obj);
                                        setTimeout(function () {
                                            connection.close();
                                        }, 500);
                                    }
                                }
                            }, {
                                noAck: true
                            });
                        });
                    });
                });

                function generateUuid() {
                    return Math.random().toString() + Math.random().toString() + Math.random().toString();
                }
            } catch (e) {
                console.log(e);
                reject("some error occured");
            }
        })
    }
}