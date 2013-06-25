var db = require('../lib/db');

var routes = function(app) {
  app.get('/', function(req, res) {
    var data = db.getData();
    return res.send('teams: ' + data.teams.length);
  });
};

module.exports = routes;
