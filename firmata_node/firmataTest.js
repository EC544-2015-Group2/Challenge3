var firmata = require('firmata'),
    xbee_api = require('xbee-api'),
    serialPort = require('serialport'),
    XbeeApiStream = require('./XbeeApiStream.js');

xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 2
});

var serialOptions = {
    baudrate: 9600,
    parser: xbeeAPI.rawParser()
};

deviceList = [];

Serial = new serialPort.SerialPort(process.argv[2], serialOptions, true, function() {
    console.log('Opened serial port');
    Serial.flush();

    xbeeAPI.on('frame_object', function(frame) {
        if (frame.type === xbee_api.constants.FRAME_TYPE.NODE_IDENTIFICATION) {
            console.log('Created new Firmata object')
            var arduino = new firmata.Board(new XbeeApiStream(frame.remote64, Serial, xbeeAPI), function() {
                console.log(arduino.pins);
                // arduino.pinMode(13, arduino.MODES.OUTPUT);
                // setInterval(function() {
                //     console.log('Set digital HIGH to device: ' + frame.remote64);
                //     arduino.digitalWrite(13, arduino.HIGH);
                // }, 2000);
                // setTimeout(function() {
                //     setInterval(function() {
                //         console.log('Set digital LOW to device: ' + frame.remote64);
                //         arduino.digitalWrite(13, arduino.LOW);
                //     }, 2000)
                // }, 1000);
            });
            deviceList.push({
                deviceId: frame.remote64,
                firmataDevice: arduino
            });
        }
    });
});
