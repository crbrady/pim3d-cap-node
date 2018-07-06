const mqtt = require('mqtt')
const fs = require('fs');

const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('properties.prop');
const client  = mqtt.connect('mqtt://' + properties.get('brokerip'));
const os = require('os');
const exec = require('child_process').exec;

var count = 0;

const hostname = os.hostname();

console.log('hostname='+hostname);
//console.log(hostname + " -- " + properties.get('brokerip'));

client.on('connect', function () {
    client.subscribe('capture');
    client.subscribe('request_heartbeat');
    client.subscribe(hostname+'_humbcapture');
    console.log(hostname+'_thumbcapture');
});



client.on('message', function (topic, message) {
    console.log(topic);

    if(topic == "capture"){
        console.log(message.toString());

        exec(message.toString(), function(error, stdout, stderr) {
            if(error){
                console.log(stderr);
            }else{
                client.publish('img', fs.readFileSync('./cap01.jpg'));
            }
        });
    }

    if(topic == hostname+'_thumbcapture'){

        console.log(message.toString());

        exec(message.toString(), function(error, stdout, stderr) {
            if(error){
                console.log(stderr);
            }else{
                client.publish(hostname+'_thumb', fs.readFileSync('./cap01_tn.jpg'));
            }
        });
    }

    if(topic == "request_heartbeat"){

        var status = {
            name: os.hostname(),
            freeRam: os.freemem(),
            totalRam: os.totalmem(),
            platform: os.platform(),
            uptime: os.uptime()
        }

        client.publish('client_status', JSON.stringify( status));
    }


    count++;
    if(count %100 ==0){
        console.log(message.toString())
    }
})




function logIt(){
    console.log("Status - MQTT Connected: " + client.connected + "  Message Count: " + count);
    setTimeout(logIt,60000);
}

logIt();




