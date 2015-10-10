var net = require('net');

var server = net.createServer(function(socket) {
	socket.write('Echo server\r\n');
	// socket.on('data', function(data){
	// 	console.log(data.toString());
	// });
	socket.pipe(socket);
});

server.listen(7654);