var socketIO = require('socket.io');
var io = socketIO.listen(process.env.PORT||7654);

// Super simple server:
//  * One room only. 
//  * We expect two people max. 
//  * No error handling.
var connections = [];
io.sockets.on('connection', function (client) {
    console.log('new connection: ' + client.id);
	connections.push(client);
	
	console.log("total connected clients: " + connections.length);
	
	client.on('createoffer', function (details) {
        client.emit('createoffer', details);
        console.log('creaetoffer: ' + JSON.stringify(details));
    });
	
    client.on('offer', function (details) {
		var toClient = connections[0];
        toClient.emit('offer', details);
        console.log('offer: released for connection 1');
    });

    client.on('answer', function (details) {
		var toClient = connections[1];
        toClient.emit('answer', details);
        console.log('answer: released to connection 2');
    });
    
    client.on('candidate', function (details) {
		var client1 = connections[0];
		var client2 = connections[1];
		if (client == client1)
		{
			console.log('candidate: emited to client 2' );
		    client2.emit('candidate', details);
		}
		 else
		 {
			 console.log('candidate: emited to client 1');
			 client1.emit('candidate', details);
		 }
        
    });

    // Here starts evertyhing!
    // The first connection doesn't send anything (no other clients)
    // Second connection emits the message to start the SDP negotation
    //client.broadcast.emit('createoffer', {});
});

io.sockets.on('disconnect', function (client) {
var index = connections.indexOf(client.id);
if (index > -1) {
  array.splice(index, 1);
}
// array = [2, 9]
console.log("disconnect happened, total connected clients: " + connections.length);
});
//console.log("listening to port 8000");
