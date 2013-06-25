var db = require('../lib/db');
var _ = require('underscore');

var routes = function(app) {
  app.get('/', function(req, res) {
    return res.json(db.getTeams());
  });
};

module.exports = routes;
