var db = require('../lib/db');
var events = require('../lib/events');

var routes = function(app) {
  app.get('/5mo734umnbt', function(req, res) {
    return res.json({ error: 'wrong needle, did you really think it would be that simple?' });
  });

  app.get('/needle83wv', function(req, res) {
    var response = db.completeChallenge6(req.param('id'));
    if (response.error) return res.json(response);

    events.add(response, 'Found the needle and made it to the final challenge');

    db.rankTeam(response.id);
    return res.json({ ok: true });
  });
};

module.exports = routes;
