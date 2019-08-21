var http = require('http'),
    fs = require('fs'),
    io = require('socket.io');

// Serves 'index.html' from the current directory.
server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  fs.readFile("asteroids.html", function (err, data) {
    if (err) throw err;
    res.write(data);
    res.end();
  });
});

server.listen(8000);
