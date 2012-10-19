var fs = require('fs')
  , connect = require('connect')
  , app = connect()
  , arDrone = require('ar-drone')
  , drone = arDrone.createClient()
  , io = require('socket.io').listen(app)


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
  socket.on('keydown', function (data) {
    console.log('down', data);

    drone[data](0.1);
  })
  socket.on('keyup', function (data) {
    drone[data](0);
    console.log('up', data);
  })
});

process.on('exit', function () {
  console.log('killing drone - BANG!!!');
  drone.land();
});