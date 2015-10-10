var firmata = require('firmata'),
    xbee_api = require('xbee-api'),
    serialPort = require('serialport'),
    XbeeApiStream = require('./XbeeApiStream.js'),
    http = require('http');

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
        if (frame.type === xbee_api.constants.FRAME_TYPE.NODE_IDENTIFICATION)
            deviceList.push(deviceId: frame.remote64);
    });

    http.createServer(function(req, res){
    	if(req.method === 'GET'){
    		var url = req.url.split('/').slice(1);
    		if(url.length === 2 && url[0] === 'devices'){
    			var xbeeStream = XbeeApiStream(url[1], Serial, xbeeAPI);
    			// res.pipe(xbeeStream);
    			// xbeeStream.pipe(res);
    	}
    		}
    }).listen(3000, function(){
    	console.log('Listening on port 3000');
    });
});
