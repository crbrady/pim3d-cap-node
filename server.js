
const http = require('http');
const url = require('url');


const mqtt = require('mqtt')
const fs = require('fs');

const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('properties.prop');
const client  = mqtt.connect('mqtt://' + properties.get('brokerip'));

var image;
var thumbnails = {};
var cam_status = {};

client.on('connect', function () {
    client.subscribe('capture');
    client.subscribe('img');
    client.subscribe('client_status');
    client.subscribe('picam2_thumb');

    //client.publish('capture', 'raspistill -v -q 100 -e jpg -ISO 100 -t 1 -n -awb incandescent -ss 150000 -w 1640 -h 1232 -o cap01.jpg')

    client.publish('picam2_thumbcapture', 'raspistill -v -q 100 -e jpg -ISO 100 -t 1 -n -awb incandescent -ss 150000 -w 320 -h 150 -o cap01_tn.jpg')

});

var tn;


client.on('message', function (topic, message) {
    if(topic == "capture"){
        console.log(message.toString());
    }

    var topicSplit = topic.split('/');
    console.log("topic= " + topic);
    if(topicSplit.length > 1){
        if(topicSplit[1] = 'thumb'){
            thumbnails[topicSplit[0]] = message;
        }
            //
            // if(topicSplit == "picam2/thumb"){
            //     console.log("tn= "+message.length);
            //     tn = message;
            // }

    }



    if(topic == "img"){
        console.log(message.length);
        image = message;
    }

    if(topic == 'client_status'){
        var statusObject = JSON.parse(message.toString());
        var isPresent = false;
        for( var i = 0; i< clientStatus.length;i++ ){
            if(statusObject.name == clientStatus[i].name){
                isPresent = true;
            }
        }

        if(!isPresent){
            clientStatus.push(statusObject);
        }
    }
});

setInterval(requestHeartbeat, 5000);

var clientStatus = [];
function requestHeartbeat(){
    clientStatus = [];
    client.publish("request_heartbeat","");
    setTimeout(sendHeartbeats, 4000);
}

function sendHeartbeats(){
    clientStatus = clientStatus.sort(function(a, b){
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
    });

    for(var i =0;i < clientStatus.length;i++){
        client.subscribe(clientStatus[i].name+'/thumb');
    }

    io.emit('heartbeats', JSON.stringify(clientStatus));
}





var server = require('http').createServer();
var io = require('socket.io')(server);
io.on('connection', function(client){
    io.emit('message', 'This is the time: ' +new Date());
    client.on('event', function(data){});
    client.on('disconnect', function(){});
});
server.listen(2000);




http.createServer(function(req, res){
    var request = url.parse(req.url, true);
    var action = request.pathname;

    if (action == '/status') {
        res.writeHead(200, {'Content-Type': 'application/json' });
        cam_status = {};
        client.publish('report');
        setInterval(function(){
            res.end(JSON.stringify(cam_status));
        },100)
    }

    if (action == '/img') {

        res.writeHead(200, {'Content-Type': 'image/jpg' });
        res.end(image, 'binary');
    }

    console.log(action);

    var actionArr = action.split('/');

    if(actionArr.length > 1)
    {
        if(actionArr[1] == 'thumb'){
            res.writeHead(200, {'Content-Type': 'image/jpg' });
            res.end(actionArr[0], 'binary');
        }
    }


}).listen(8080, '127.0.0.1');
