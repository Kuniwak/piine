// This script licensed under the MIT.
// http://orgachem.mit-license.org

var io = require('socket.io').listen(8080);

var userCounter = 0;

io.sockets.on('connection', function (socket) {
  socket.on('send_piine', function () {
    console.log('piine!');
    socket.volatile.broadcast.emit('receive_piine');
  });

  socket.on('disconnect', function() {
    socket.broadcast.emit('change_user_count', --userCounter);
  });

  socket.emit('change_user_count', ++userCounter);
  socket.broadcast.emit('change_user_count', userCounter);
});
