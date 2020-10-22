const zmq = require("zeromq/v5-compat");
const { v1 } = require("uuid");

class Client {
  constructor(sub = undefined) {
    this.req = zmq.socket("req");
    this.sub = zmq.socket("sub");

    // receiving replies
    this.req.on(
      "message",
      function (msg) {
        const { message, response, error } = JSON.parse(msg);
        if (message in this.callbacks) {
          this.callbacks[message](response, error);
          delete this.callbacks[message];
        }
      }.bind(this)
    );

    if (sub) {
      this.sub.on("message", function (topic, msg) {
        sub(msg.toString());
      });
    }

    // dictionary of callbacks when receiving replies
    this.callbacks = {};
  }

  connect(port_req, port_sub = undefined) {
    this.req.connect(`tcp://127.0.0.1:${port_req}`);

    if (port_sub) {
      this.sub.connect(`tcp://127.0.0.1:${port_sub}`);
      this.sub.subscribe("message");
    }
  }

  invoke(function_name, args, callback) {
    let callbackKey = v1();
    this.callbacks[callbackKey] = callback;
    this.req.send(
      JSON.stringify({
        message: "INVOKE",
        function_name: function_name,
        args: args,
        callback: callbackKey,
      })
    );
  }

  send(message) {
    this.req.send(JSON.stringify({ message: message }));
  }
}

module.exports = Client;
