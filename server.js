
const http = require('http');
const url = require('url');


const mqtt = require('mqtt')
const fs = require('fs');

const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('properties.prop');
const client  = mqtt.connect('mqtt://' + properties.get('brokerip'));

var image;

client.on('connect', function () {
    client.subscribe('capture')
    client.subscribe('img')
    client.publish('capture', 'raspistill -v -q 100 -e jpg -ISO 100 -t 1 -n -awb incandescent -ss 150000 -w 1640 -h 1232 -o cap01.jpg')
})

client.on('message', function (topic, message) {
    if(topic == "capture"){
        console.log(message.toString());
    }

    if(topic == "img"){
        console.log(message.length)
        image = message;
    }

})




http.createServer(function(req, res){
    var request = url.parse(req.url, true);
    var action = request.pathname;

    if (action == '/img') {

        res.writeHead(200, {'Content-Type': 'image/jpg' });
        res.end(image, 'binary');
    } else {
        res.writeHead(200, {'Content-Type': 'text/plain' });
        res.end('Hello World \n');
    }
}).listen(8080, '127.0.0.1');
