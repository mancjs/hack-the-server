var db = require('../lib/db');

var routes = function(app) {
  app.get('/register', function(req, res) {
    return res.json({ error: 'do you normally make GET requests to create an account? ;)' });
  });

  app.post('/register', function(req, res) {
    var response = db.registerTeam(req.body && req.body.name, req.body && req.body.email);
    if (response.error) return res.json(response);

    killTeamIn(response.id, 60);
    return res.json({ msg: 'team id ' + response.id + ' registered – validate (POST /validate) within 60s or die' });
  });

  app.post('/validate', function(req, res) {
    var response = db.validateTeam(req.body && req.body.id);
    if (response.error) return res.json(response);

    return res.json({ ok: true });
  });
};

var killTeamIn = function(id, seconds) {
  setTimeout(function() { db.killTeam(id); }, seconds * 1000);
};


module.exports = routes;
