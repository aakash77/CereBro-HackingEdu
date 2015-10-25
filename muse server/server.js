var osc = require('node-osc'),
    io = require('socket.io').listen(5000,{log:false});

var oscServer, oscClient;

var listOfAllowedCommands = ['/muse/elements/experimental/mellow','/muse/elements/theta_session_score','/muse/elements/horseshoe','/muse/elements/touching_forehead'];
io.sockets.on('connection', function (socket) {
  socket.on("config", function (obj) {
    oscServer = new osc.Server(obj.server.port, obj.server.host);
    oscClient = new osc.Client(obj.client.host, obj.client.port);

    oscClient.send('/status', socket.sessionId + ' connected');

    oscServer.on('message', function(msg, rinfo) {
		
		listOfAllowedCommands.every(function(allowedCommands){
			if(allowedCommands == msg[0]){
				console.log(msg[0]);
				socket.emit("message", msg);
				return false;
			}
			return true;
		});
    });
  });
  
  /*
  socket.on("message", function (obj) {
	  console.log(obj);
    oscClient.send(obj);
  });*/
});