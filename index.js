const mqtt = require('mqtt')
const fs = require('fs');

const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('properties.prop');
const client  = mqtt.connect('mqtt://' + properties.get('brokerip'));
const os = require('os');
const exec = require('child_process').exec;

var count = 0;

const hostname = os.hostname();

//console.log(hostname + " -- " + properties.get('brokerip'));

client.on('connect', function () {
    client.subscribe('capture')
})

client.on('message', function (topic, message) {
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
    count++;
    if(count %100 ==0){
        console.log(message.toString())
    }
})




function logIt(){
    console.log("Status - MQTT Connected: " + client.connected + "  Message Count: " + count);
    setTimeout(logIt,10000);
}

logIt();




