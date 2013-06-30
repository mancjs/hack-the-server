var db = require('../lib/db');
var events = require('../lib/events');

var routes = function(app) {
  app.get('/event/:id', function(req, res) {
    var id = parseInt(req.param('id'), 10);
    var ev = events.getNext(id);
    return res.json(ev);
  });
};

module.exports = routes;
