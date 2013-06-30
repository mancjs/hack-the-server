var db = require('../lib/db');
var events = require('../lib/events');

var routes = function(app) {
  app.all('/' + new Buffer('/challenge2').toString('base64'), function(req, res) {
    return res.json({ error: 'this is the encoded version of the URL, you want the decoded version' });
  });

  app.all('/challenge2', function(req, res) {
    if (req.method !== 'PUT') {
      return res.json({ error: 'who said I respond to ' + req.method + '?' });
    }

    var response = db.completeChallenge2(req.body && req.body.id);
    if (response.error) return res.json(response);

    events.add(response, 'Made it to challenge 3');

    return res.json({
      msg: 'not bad, let\'s up the level a bit...',
      nextUrl: 'challenge_number_three',
      hint: 'you will want to hash that URL with one of the SHA algorithms (better start guessing), and encode as hex',
      verb: 'GET'
    });
  });
};

module.exports = routes;
