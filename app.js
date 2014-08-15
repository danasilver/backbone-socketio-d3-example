var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    sqlite3 = require('sqlite3').verbose();

var fs = require('fs');
var path = require('path');

var db = new sqlite3.Database('default.db');

db.run('CREATE TABLE IF NOT EXISTS chat ('
      + 'id INTEGER PRIMARY KEY AUTOINCREMENT,'
      + 'message TEXT NOT NULL,'
      + 'sender CHAR(30) NOT NULL);');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use('/static', express.static(__dirname + '/static'));
app.use('/modules', express.static(__dirname + '/modules'));

server.listen(process.env.PORT || 3000);

io.sockets.on('connection', function(socket) {
  socket.on('message:create', function(data, callback) {
    db.serialize(function() {
      var stmt = db.prepare('INSERT INTO CHAT (message, sender) '
                           + 'VALUES (?, ?);');
      stmt.run(data.message, data.sender, function() {
        var json = {
          id: this.lastID,
          sender: data.sender,
          message: data.message
        };
        callback(null, json);
        socket.broadcast.emit('messages:create', json);
      });
    });
  });

  socket.on('messages:read', function(data, callback) {
    db.all('SELECT * FROM chat;', function(err, rows) {
      callback(null, rows);
    });
  });
});

app.get('/', function(req, res) {
  var directory = __dirname + '/modules';
  var modules = [];
  var scripts = [];
  var count;
  fs.readdir(directory, function(err, files) {
    count = files.length;
    files.forEach(function(file) {
      var modulePath = path.resolve(directory, file);
      fs.stat(modulePath, function(err, stat) {
        if (stat.isDirectory()) {
          fs.readFile(path.resolve(modulePath, 'manifest.json'), function(err, data) {
            if (err) throw err;
            var manifest = JSON.parse(data);
            manifest.js.forEach(function(js) {
              scripts.push('/modules/' + file + '/' + js);
            });
            modules.push({ name: manifest.name, main: manifest.main });
            count--;
            if (count === 0) {
              res.render('module', {scripts: scripts, modules: modules});
            }
          });
        }
      });
    });
  });
});