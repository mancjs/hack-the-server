var db = require('../lib/db');
var events = require('../lib/events');

var routes = function(app) {
  app.get('/5mo734umnbt', function(req, res) {
    return res.json({ error: 'wrong needle, did you really think it would be that simple?' });
  });

  app.get('/needle83wv', function(req, res) {
    var response = db.completeChallenge6(req.param('id'));
    if (response.error) return res.json(response);
    if (response.key) return res.json({ error: response.teamWithKey + ' has your key' });

    events.add(response, 'Found the needle and made it to the final challenge');

    var teamWithKey = db.generateKey(response);

    return res.json({
      msg: 'you are now on the final challenge',
      hint: teamWithKey + ' now holds your key to finishing',
      nextUrl: '/finish/<your key here>'
    });
  });
};

module.exports = routes;
