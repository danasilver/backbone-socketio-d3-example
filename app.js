var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('default.db');

db.run('CREATE TABLE IF NOT EXISTS chat ('
      + 'id INTEGER PRIMARY KEY AUTOINCREMENT,'
      + 'message TEXT NOT NULL,'
      + 'sender CHAR(30) NOT NULL);');

app.use('/static', express.static(__dirname + '/static'));

server.listen(process.env.PORT || 3000);

io.sockets.on('connection', function(socket) {
  socket.on('message:create', function(data) {
    console.log(data);
    db.serialize(function() {
      var stmt = db.prepare('INSERT INTO CHAT (message, sender) '
                           + 'VALUES (?, ?);');
      stmt.run(data.message, data.sender, function() {
        var json = {
          message: this.lastID,
          sender: data.sender,
          message: data.message
        };
        socket.emit('messages:create', json);
        socket.broadcast.emit('messages:create', json);
      });
    });
  });

  socket.on('messages:read', function(data) {
    db.all('SELECT * FROM chat;', function(err, rows) {
      console.log(rows);
    });
  });
});

app.get('/', function(req, res) {
  res.sendfile('static/index.html');
});