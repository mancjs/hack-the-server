var http = require('http');
var express = require('express');
var mustachex = require('mustachex');
var throttle = require('./lib/throttle');
var db = require('./lib/db');

var app = express();
throttle.enable();

app.configure(function() {
  app.engine('html', mustachex.express);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser({ uploadDir: __dirname + '/uploaded' }));
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.all('*', function(req, res, next) {
  if (req.url === '/' || req.url === '/favicon.ico' || req.url === '/renderteams' || req.url.match(/^\/event/g) || req.url.match(/^\/debug/g)) {
    return next();
  }

  console.log('not skipping');
  console.log(req.url);

  var throttled = throttle.isThrottled(req.connection.remoteAddress);
  return throttled ? res.json({ error: 'enhance your calm John Spartan', bannedFor: '2 minutes' }) : next();
});

require('./routes/debug')(app);
require('./routes/events')(app);
require('./routes/dashboard')(app);
require('./routes/challenge1')(app);
require('./routes/challenge2')(app);
require('./routes/challenge3')(app);
require('./routes/challenge4')(app);
require('./routes/challenge5')(app);
require('./routes/challenge6')(app);
require('./routes/challenge7')(app);

http.createServer(app).listen(8808);
