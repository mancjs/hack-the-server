var db = require('../lib/db');
var events = require('../lib/events');

var routes = function(app) {
  app.get('/0/100', function(req, res) {
    return res.json({ error: 'there are more things screwed than just that' });
  });

  app.get('/43008/100', function(req, res) {
    return res.json({ error: 'fixed left, but not right' });
  });

  app.get('/0/45', function(req, res) {
    return res.json({ error: 'fixed right, but not left' });
  });

  app.get('/43008/45', function(req, res) {
    var response = db.completeChallenge5(req.param('id'));
    if (response.error) return res.json(response);

    events.add(response, 'Fixed the code and made it to challenge 6');

    return res.json({
      msg: 'nice job',
      nextUrl: '/files/haystack.zip',
      hint: 'find the needle in the haystack'
    });
  });
};

module.exports = routes;