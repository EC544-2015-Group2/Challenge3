var http = require('http'),
    firmata = require('firmata'),
    xbee_api = require('xbee-api'),
    serialPort = require('serialport'),
    XbeeApiStream = require('./XbeeApiStream.js');

const PORT = 8080;

xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 2
});

var serialOptions = {
    baudrate: 9600,
    parser: xbeeAPI.rawParser()
};

var deviceList = [];

var Serial = new serialPort.SerialPort(process.argv[2], serialOptions, true, function() {
    console.log('Opened serial port');

    xbeeAPI.on('frame_object', function(frame) {
        if (frame.type === xbee_api.constants.FRAME_TYPE.NODE_IDENTIFICATION)
            deviceList.push(frame.remote64);
    });
    var server = http.createServer(httpRequestHandler);

    server.listen(PORT, function() {
        console.log("Server listening on: http://localhost:%s", PORT);
    });

})
    //Serial.flush();



function httpRequestHandler(request, response) {
    console.log('callback used');
    if (request.method === 'GET') {
        var url = request.url.split('/').slice(1);
        console.log(request.url);
        console.log('get request received');
        if (url.length > 0) {
            if (url[0] === 'device') {
                if (url.length > 1) {
                    if (deviceList.filter(function(element) {
                            return element === url[1];
                        }).length > 0) {
                        var xbeeStream = new XbeeApiStream(url[1], Serial, xbeeAPI);
                        var arduino = new firmata.Board(xbeeStream, function() {
                            console.log(arduino.pins);
                        });
                        if (url[2] === 'pin') {
                            if (pinID.filter(function(element) {
                                    return element === url[3];
                                }).length > 0) {
                                response.end(JSON.stringify(arduino.digitalRead(url[3]))); // send device ID, pin ID
                            } else response.end('Error: Pin ID not found');
                        } else response.end(JSON.stringify(arduino.pins)); // send device ID, pins
                    } else response.end('Error: No device found with that ID'); // send error in device ID request
                } else response.end(JSON.stringify(deviceList)); // send array of devices and IDs 
            } else response.end('error in request, must request in the format /device/deviceID/pin/pinID'); // send error in request
        } else response.end('error in url'); // send error in url received
    } else if (request.method === 'POST') {
        var url = request.url.split('/').slice(1);
        // var pos = LEDCommandIndex();
        if (url.length === 5) {
            if (url[0] === 'device') {
                if (deviceID.filter(function(element) {
                        return element === url[1];
                    }).length > 0) {
                    if (url[2] === 'pin') {
                        if (pinID.filter(function(element) {
                                return element === url[3];
                                var xbeeStream = XbeeApiStream(url[1], Serial, xbeeAPI);
                                var arduino = new firmata.Board(xbeeStream, function() {
                                    console.log('Accessed board pins, attempting to write...')
                                })
                            }).length > 0) {
                            if (url[5] === 'HIGH') {
                                arduino.digitalWrite(url[3], 'HIGH');
                                console.log('set pin ' + url[3] + 'to HIGH');
                            } else if (url[5] === 'LOW') {
                                arduino.digitalWrite(url[3], 'LOW');
                                console.log('set pin ' + url[3] + 'to LOW');
                            } else response.end('Error: Please specify HIGH or LOW')
                        } else response.end('Error: url should be of format /device/deviceID/pin/pinID/HIGH or LOW') // send error in request
                    } else response.end('Error: url should be of format /device/deviceID/pin/pinID/HIGH or LOW') // send error in request
                } else response.end('Error: url should be of format /device/deviceID/pin/pinID/HIGH or LOW') // send error in request
            } else response.end('Error: url should be of format /device/deviceID/pin/pinID/HIGH or LOW') // send error in request
        } else response.end('Error: url should be of format /device/deviceID/pin/pinID/HIGH or LOW') // send error in request
    }
}



// function LEDCommandIndex(){
//          if (url.indexOf('HIGH') !== -1) {
//              return(url.indexOf('HIGH'));
//          } else if (url.indexOf('LOW') !== -1) {
//              return(url.indexOf('LOW'));
//          } else {
//              response.end() // no pin setting sent
//          }
//      }
