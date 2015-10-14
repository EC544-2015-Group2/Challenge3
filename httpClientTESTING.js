var http = require('http');
var options = {
	port: 80,
	method: 'GET',
	path: '/device'
};

console.log('program is actually fucking getting called')

callback = function(response) {
	console.log('sent request');
	var str = '';

	response.on('data', function(chunk) {
		str += chunk;
		console.log('data received')
	});

	response.on('end', function () {
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