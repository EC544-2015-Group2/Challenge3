var net = require('net');
var dns = require('dns');

dns.lookup('ec544-group2.ddns.net', function(err, address) {
    var client = new net.Socket();
    console.log(address);
    client.connect(7654, address, function() {
        console.log('Connected');
        client.write('Hello, server! Love, Client.');
    });

    client.on('data', function(data) {
        console.log('Received: ' + data);
        // client.destroy(); // kill client after server's response
    });

    client.on('close', function() {
        console.log('Connection closed');
    });
});
