import zmq

def create_reply(message, payload, error=None):
    return {
        "message": message,
        "response": payload,
        "error": error
    }


class Server:
    def __init__(self, functions):
        self.context = zmq.Context()
        self.rep = self.context.socket(zmq.REP)
        self.pub = self.context.socket(zmq.PUB)

        self.functions = functions
        self.functions._publish = self.publish
        self.functions_mapping = [func for func in dir(self.functions) if callable(
            getattr(self.functions, func)) and not func.startswith("_")]

        self.is_running = False

    def bind(self, port_rep, port_pub=None):
        self.rep.bind(f"tcp://0.0.0.0:{port_rep}")

        if port_pub is not None:
            self.pub.bind(f"tcp://0.0.0.0:{port_pub}")

    def run(self):
        self.is_running = True
        while self.is_running:
            print("receiving")
            message = self.rep.recv_json()

            if message['message'] == "INVOKE":
                invoke_func = getattr(
                    self.functions, message["function_name"], -1)
                if invoke_func != -1 and callable(invoke_func):
                    try:
                        self.rep.send_json(create_reply(
                            message["callback"], invoke_func(self.functions, **message["args"])))
                    except Exception as e:
                        self.rep.send_json(create_reply(
                            message["callback"], None, error=repr(e)))
                else:
                    self.rep.send_json(create_reply(
                        message["callback"], None, error="Function Not Found"))
            else:
                self.is_running = False
                self.context.destroy()
                break

    def publish(self, msg):
        self.pub.send_multipart(
            ["message".encode("utf-8"), msg.encode("utf-8")])
