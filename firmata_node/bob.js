var http = require('http');
// firmata = require('firmata'),
// xbee_api = require('xbee-api'),
// serialPort = require('serialport'),
// XbeeApiStream = require('./XbeeApiStream.js');

const PORT = 8080;



var server = http.createServer(httpRequestHandler);

server.listen(PORT, function() {
    console.log("Server listening on: http://localhost:%s", PORT);
});


function httpRequestHandler(request, response) {
    console.log('callback used');
    if (request.method === 'GET') {
        var url = request.url.split('/').slice(1);
        console.log(url);
        console.log('get request received');
        if (url.length > 0) {
            if (url[0] === 'device') {
                console.log('device request received');
                response.end('here is the device stuff')

            }
        }
    } else response.end('not get request');
}
