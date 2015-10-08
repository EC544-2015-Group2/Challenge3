var http = require('http');
var options = {
	port: 80,
	method: 'GET',
	path: '/device'
};

callback = function(response) {
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