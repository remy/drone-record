var fs = require('fs')
  , connect = require('connect')
  , app = connect()
  , arDrone = require('ar-drone')
  , drone = arDrone.createClient()
  , io = require('socket.io').listen(app)
  , recordState = []
  , timeline = require('./timeline')

drone.disableEmergency();

var t = timeline(drone).record();

app.use(connect.static(__dirname));

app.listen(4000);

var throttleValue = 0.5

io.sockets.on('connection', function (socket) {
  socket.on('keydown', function (command) {
    var tv = throttleValue;

    if (['up', 'down', 'clockwise', 'counterClockwise'].indexOf(command) !== -1) {
      tv = 1;
    }

    console.log('down', command);
    if(command == 'flip')
    {
      drone.animate('flipAhead', 15)
    }
    else
    {
      drone[command](tv);
    }
  })
  socket.on('keyup', function (command) {
    if(command == 'takeoff' || command == 'land' || command == 'flip')
    {
      return
    }
    recordState.push({ command: command, deg: 0, timestamp: Date.now() })
    drone[command](0);
    console.log('up', command);
  })

  socket.on('dump', function () {
    socket.emit('dump', t.toString());
  }).on('playback', function (script) {
    console.log('playing back.', script)
    t.playback();
  })
});

process.on('exit', function () {
  console.log('killing drone - BANG!!!');
  drone.land();
});








