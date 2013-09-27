// This script licensed under the MIT.
// http://orgachem.mit-license.org

var io = require('socket.io').listen(8080);

var uid = 0;

io.sockets.on('connection', function (socket) {
  console.log('connection');
  socket.on('message', function (msg) {
    console.log('piine!', msg);
    socket.volatile.broadcast.send('piine!');
  });
});
