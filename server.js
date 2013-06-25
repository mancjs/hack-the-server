var http = require('http');
var express = require('express');
var mustachex = require('mustachex');
var throttle = require('./lib/throttle');
var db = require('./lib/db');

var app = express();

app.configure(function() {
  app.engine('html', mustachex.express);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.all('*', function(req, res, next) {
  var throttled = throttle.isThrottled(req.connection.remoteAddress);
  return throttled ? res.json({ error: 'enhance your calm', bannedFor: '2 minutes' }) : next();
});

require('./routes/dashboard')(app);
require('./routes/register')(app);

http.createServer(app).listen(8808);
