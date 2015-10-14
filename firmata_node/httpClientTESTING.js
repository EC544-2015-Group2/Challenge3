var http = require('http');
var options = {
    port: 8080,
    method: 'GET',
    path: '/device/0013a20040a03e02/pin/7'
};

console.log('the client is starting')
callback = function(response) {
    console.log('client callback being used')
    var str = '';

    response.on('data', function(chunk) {
        str += chunk;
        console.log('data received')
    });

    response.on('end', function() {
        console.log(str);
    });
}

http.request(options, callback).end();

// http.request(options, function(response) {
// 	console.log('message sent');
// 	response.on('data', function (chunk) {
// 		console.log(chunk);
// 	});
// });
