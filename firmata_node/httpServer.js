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
    Serial.flush();

    xbeeAPI.on('frame_object', function(frame) {
        if (frame.type === xbee_api.constants.FRAME_TYPE.NODE_IDENTIFICATION) {
            deviceList.push(frame.remote64);
            console.log(frame);
        }
    });
    var server = http.createServer(httpRequestHandler);

    server.listen(PORT, function() {
        console.log("Server listening on: http://localhost:%s", PORT);
    });

});



function httpRequestHandler(request, response) {
    var url = request.url.split('/').slice(1);
    console.log(request.url);
    if (url.length > 0) {
        if (url[0] === 'device') {
            if (url.length > 1) {
                if (deviceList.filter(function(element) {
                        return element === url[1];
                    }).length > 0) {
                    var xbeeStream = new XbeeApiStream(url[1], Serial, xbeeAPI);
                    var arduino = new firmata.Board(xbeeStream, function() {
                        if (url[2] === 'pin') {
                            if (request.method === 'GET')
                                response.end(JSON.stringify(getPin(arduino, url[3])));
                            else if (request.method === 'POST') response.end(setPin(arduino, url[3], url[4]));
                        } else response.end(JSON.stringify(arduino.pins)); // send device ID, pins
                    });
                } else response.end('Error: No device found with that ID'); // send error in device ID request
            } else response.end(JSON.stringify(deviceList)); // send array of devices and IDs 
        } else response.end('error in request, must request in the format /device/deviceID/pin/pinID'); // send error in request
    } else response.end('error in url'); // send error in url received
}

function setPin(arduino, pin, value) {
    if (pin && value) {
        if (value === 'HIGH') value = arduino.HIGH;
        else if (value === 'LOW') value = arduino.LOW;
        arduino.pinMode(pin, arduino.MODES.OUTPUT);
        arduino.digitalWrite(pin, value);
    }
}

function getPin(arduino, pin) {
    if (pin) {
        var _isAnalog = false;
        if (pin[0] === 'A') {
            _isAnalog = true;
            pin = pin.slice(1);
        }
        pin = parseInt(pin);
        if (_isAnalog) {
            var analogPins = arduino.pins.filter(getAnalogPins);
            if (pin < analogPins.length) return analogPins[pin];
        } else {
            var digitalPins = arduino.pins.filter(getDigitalPins);
            if (pin < digitalPins.length) return digitalPins[pin];
        }
    }
    return 'ERROR: No matching pin found';
}

function getDigitalPins(item) {
    return item.analogChannel === 127;
}

function getAnalogPins(item) {
    return item.analogChannel !== 127;
}
