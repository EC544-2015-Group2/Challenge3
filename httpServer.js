var http = require('http');

const PORT = 8080;

function handleRequest(request, response) {
	if (request.method === 'GET'){
		var url = request.url.split('/');
		if(url.length > 0) {
			if (url[0] === 'device') {
				if (url[1].length > 1){
					if (deviceID.filter(function (element){
						return element === url[1];
					}).length > 0) {
						if (url[2] === 'pin') {
							if (pinID.filter(function (element){
								return element === url [3];
							}).length > 0) {
								response.end() // send device ID, pin ID
							}
						} else {
							response.end() // send device ID
						}
					} else {
						response.end() // send error in device ID request
					}
				} else {
					response.end() // send array of devices and IDs 
				}
			} else {
				response.end() // send error in request
			}
		} else { 
			response.end() // send error in url received
		}
	} else if (request.method === 'POST'){
		var url = request.url.split('/');
		// var pos = LEDCommandIndex();
		if(url.length === 5) {
			if (url[0] === 'device') {
				if (deviceID.filter(function (element){
					return element === url[1];
				}).length > 0) {
					if (url[2] === 'pin') {
						if (pinID.filter(function (element){
							return element === url [3];
						}).length > 0) {
							if (url[5] === 'HIGH') {
									// set url[4] to HIGH
								} else if (url[5] === 'LOW') {
									// set url[4] to LOW
								}
							} else {
							response.end() // send error in request
						} 
					} else {
						response.end() // send error in request
					}
				} else {
					response.end() // send error in request
				}
			} else {
				response.end() // send error in request
			}
		} else {
			response.end() // send error in request
		}
	}
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
	console.log("Server listening on: http://localhost:%s", PORT);
});

// function LEDCommandIndex(){
// 			if (url.indexOf('HIGH') !== -1) {
// 				return(url.indexOf('HIGH'));
// 			} else if (url.indexOf('LOW') !== -1) {
// 				return(url.indexOf('LOW'));
// 			} else {
// 				response.end() // no pin setting sent
// 			}
// 		}