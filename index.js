var express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var md5 = require('md5');

var port = 3000;
var database_file = 'cnline.db';

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Database
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(database_file);

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS  users (username varchar(50),password varchar(64))");
});

// Set frontend path
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');

// Routing
app.get('/login', function(req, res) {
  res.render('login', { title: 'login' });
});
app.get('/register', function(req, res) {
  res.render('register', { title: 'register' });
});
app.get('/chat', function(req, res){
  res.render('chat', { title: 'chat' });
});

app.post('/register', function(req, res, next) {
  var username = req.body.username;
  var password = md5(req.body.password);
  var query = 'INSERT INTO users (username, password) VALUES ("' + username + '", ' + '"' + password + '")';
  db.serialize(function() {
    db.run(query);
  });
});

io.on('connection', function(){ /* … */ });
