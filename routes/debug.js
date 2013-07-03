var db = require('../lib/db');

var routes = function(app) {
  app.get('/debug/114797', function(req, res) {
    return res.json(db.getTeams());
  });

  app.get('/debug/114797/kill/:id', function(req, res) {
    db.killTeam(req.param('id'), true);
    return res.redirect('/debug/114797');
  });
};

module.exports = routes;
