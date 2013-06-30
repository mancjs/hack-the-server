var db = require('../lib/db');
var events = require('../lib/events');

var routes = function(app) {
  app.get('/register', function(req, res) {
    return res.json({ error: 'do you normally make GET requests to create an account? ;)' });
  });

  app.post('/register', function(req, res) {
    var response = db.registerTeam(req.body && req.body.name, req.body && req.body.email);
    if (response.error) return res.json(response);

    killTeamIn(response.id, 60);
    events.add(response, 'A Challenger Appears!');
    return res.json({ msg: 'team id ' + response.id + ' created – validate (POST /validate) within 60s or die' });
  });

  app.post('/validate', function(req, res) {
    var response = db.validateTeam(req.body && req.body.id);
    if (response.error) return res.json(response);

    var nextUrl = new Buffer('/challenge2').toString('base64');
    events.add(response, 'Figured out how to register and made it to challenge 2!');
    return res.json({ msg: 'congratulations – just in time', nextUrl: nextUrl });
  });
};

var killTeamIn = function(id, seconds) {
  setTimeout(function() { db.killTeam(id, false); }, seconds * 1000);
};

module.exports = routes;
