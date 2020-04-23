const zmq = require("zeromq/v5-compat");
const uuidv1 = require("uuid/v1");

class Client {
  constructor() {
    this.socket = zmq.socket("req");
    this.socket.on(
      "message",
      function(msg) {
        const { message, response, error } = JSON.parse(msg);
        if (message in this.callbacks) {
          this.callbacks[message](response, error);
          delete this.callbacks[message];
        }
      }.bind(this)
    );
    this.callbacks = {};
  }

  connect(port) {
    this.socket.connect(port);
  }

  invoke(function_name, args, callback) {
    let callbackKey = uuidv1();
    this.callbacks[callbackKey] = callback;
    this.socket.send(
      JSON.stringify({
        message: "INVOKE",
        function_name: function_name,
        args: args,
        callback: callbackKey
      })
    );
  }

  send(message) {
    this.socket.send(JSON.stringify({ message: message }));
  }
}

module.exports = Client;
