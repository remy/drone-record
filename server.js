var fs = require('fs')
  , connect = require('connect')
  , app = connect()
  , arDrone = require('ar-drone')
  , drone = arDrone.createClient()
  , io = require('socket.io').listen(app)
  , timeline = require('./timeline')
  , recordState = []

app.use(connect.static(__dirname));

var t = timeline(drone).record();

app.listen(4000);

io.sockets.on('connection', function (socket) {
  socket.on('keydown', function (command) {
    drone[command](0.1);
  })
  socket.on('keyup', function (command) {
    drone[command](0);
  })

  socket.on('reset', function () {
    t.reset();
  }).on('playback', function (script) {
    t.playback();
  })
});

