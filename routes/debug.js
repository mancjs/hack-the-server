var db = require('../lib/db');

var routes = function(app) {
  app.get('/debug', function(req, res) {
    return res.json(db.getTeams());
  });

  app.get('/debug/kill/:id', function(req, res) {
    db.killTeam(req.param('id'), true);
    return res.redirect('/debug');
  });
};

module.exports = routes;
