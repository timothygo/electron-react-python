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
        self.socket = self.context.socket(zmq.REP)
        self.functions = functions
        self.functions_mapping = [func for func in dir(self.functions) if callable(getattr(self.functions, func)) and not func.startswith("__")]
        self.is_running = False
    
    def bind(self, port):
        self.socket.bind(port)

    def run(self):
        self.is_running = True
        while self.is_running:
            print("receiving")
            message = self.socket.recv_json()

            if message['message'] == "INVOKE":
                invoke_func = getattr(self.functions, message["function_name"], -1)
                if invoke_func != -1 and callable(invoke_func):
                    try:
                        self.socket.send_json(create_reply(message["callback"], invoke_func(self.functions, **message["args"])))
                    except Exception as e:
                        self.socket.send_json(create_reply(message["callback"], None, error=repr(e)))
                else:
                    self.socket.send_json(create_reply(message["callback"], None, error="Function Not Found"))
            else:
                self.is_running = False
                self.context.destroy()
                break
