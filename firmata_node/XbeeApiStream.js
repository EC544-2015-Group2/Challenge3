var Duplex = require('stream').Duplex,
    util = require('util'),
    xbee_api = require('xbee-api');
util.inherits(XbeeApiStream, Duplex);

function XbeeApiStream(deviceId, serialPort, xbeeApi) {
    this.deviceId = deviceId;
    this.serialPort = serialPort;
    this.xbeeApi = xbeeApi;
    this.xbeeListener = function(frame) {
        // console.log(frame)
        if (frame.type === xbee_api.constants.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET && frame.remote64 === this.deviceId) {
            this.push(frame.data);
            console.log('Received: ');
            console.log(frame.data);
        }
    }.bind(this)
    Duplex.call(this);

    this.xbeeApi.on('frame_object', xbeeListener);
}

XbeeApiStream.prototype._read = function() {
    // Here just to satisfy the requirement of extending Duplex. Doesn't need to do anything at all.
}

XbeeApiStream.prototype._write = function(chunk, encoding, callback) {
    console.log('Sent: ');
    console.log(chunk);
    this.serialPort.write(this.xbeeApi.buildFrame({
        type: xbee_api.constants.FRAME_TYPE.ZIGBEE_TRANSMIT_REQUEST,
        destination64: this.deviceId,
        data: chunk
    }), function(err) {
        if (typeof encoding === 'function' || typeof encoding === 'undefined') callback = encoding;
        if (callback)
            if (err) callback(err);
            else this.serialPort.drain(callback);
    }.bind(this));
    return true;
}

XbeeApiStream.prototype.detachEventHandlers = function() {
    this.xbeeApi.removeListener('frame_object', this.xbeeListener);
}

module.exports = XbeeApiStream;
