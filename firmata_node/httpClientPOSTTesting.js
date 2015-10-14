var http = require('http');
var options = {
    port: 8080,
    method: 'POST',
    path: '/device/0013a20040a03e02/pin/13/LOW'
};

console.log('POST client is starting...')
callback = function(res) {
    console.log('POST client callback being used');
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
        console.log('BODY: ' + chunk);
    });
    res.on('end', function() {
        console.log('No more data in response.')
    })
};

req = http.request(options, callback).end();

