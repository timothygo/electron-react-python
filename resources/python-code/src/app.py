from zeromq.Server import Server
import json

class Endpoints:
    def hello(self):
        with open("resources/test.json", "r") as file:
            return json.load(file)['data']

server = Server(Endpoints)
server.bind("tcp://0.0.0.0:4242")
server.run()