const mqtt = require('mqtt')

const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('properties.prop');
const client  = mqtt.connect('mqtt://' + properties.get('brokerip'));
const os = require('os');

var count = 0;

const hostname = os.hostname();

//console.log(hostname + " -- " + properties.get('brokerip'));

client.on('connect', function () {
    client.subscribe('capture')
    client.publish('capture', 'raspistill -v -q 100 -e jpg -ISO 100 -t 1 -n -awb incandescent -ss 150000 -w 1640 -h 1232 -o cap01.jpg')
})

client.on('message', function (topic, message) {
    if(topic == "capture"){
        console.log(message.toString());
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
