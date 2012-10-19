var fs = require('fs')
  , connect = require('connect')
  , app = connect()
  , arDrone = require('ar-drone')
  , drone = arDrone.createClient()
  , io = require('socket.io').listen(app)
  , recordState = []

drone.disableEmergency();

app.use(connect.static(__dirname));

app.listen(4000);

// function handler (req, res) {
//   fs.readFile(__dirname + '/index.html',
//   function (err, data) {
//     if (err) {
//       res.writeHead(500);
//       return res.end('Error loading index.html');
//     }

//     res.writeHead(200);
//     res.end(data);
//   });
// }

io.sockets.on('connection', function (socket) {
  socket.on('keydown', function (command) {
    console.log('down', command);
    recordState.push({ command: command, deg: 0.1, timestamp: Date.now() })
    drone[command](0.1);
  })
  socket.on('keyup', function (command) {
    recordState.push({ command: command, deg: 0, timestamp: Date.now() })
    drone[command](0);
    console.log('up', command);
  })

  socket.on('dump', function () {
    var js = '', // yes, this is fucked
        last = null;
    recordState.forEach(function (data) {
      var diff = 0;
      if (!last) {
        js += 'drone.' + data.command + '(' + data.deg + ');\ndrone\n';
      } else {
        // work out the diff
        diff = data.timestamp - last;
        js += '.after(' + diff + ', function () { this.' + data.command + '(' + data.deg + '); })\n';
      }
      last = data.timestamp;
    });
    console.log(js);
  })
});

process.on('exit', function () {
  console.log('killing drone - BANG!!!');
  drone.land();
});








