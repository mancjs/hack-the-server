var crypto = require('crypto');
var db = require('../lib/db');
var events = require('../lib/events');

var sha = function(kind, data) {
  return crypto.createHash(kind).update(data).digest('hex');
};

var routes = function(app) {
  app.get('/challenge_number_three', function(req, res) {
    return res.json({ error: 'just thought you\'d give it a shot, huh?' });
  });

  app.get('/' + sha('sha1', 'challenge_number_three'), function(req, res) {
    return res.json({ error: 'good try, but it\'s not SHA1' });
  });

  app.get('/' + sha('sha256', 'challenge_number_three'), function(req, res) {
    return res.json({ error: 'Nope, it\'s not SHA256' });
  });

  app.get('/' + sha('sha512', 'challenge_number_three'), function(req, res) {
    var response = db.completeChallenge3(req.param('id'));
    if (response.error) return res.json(response);

    events.add(response, 'Figured out which SHA algorithm to use and made it to challenge 4');

    return res.json({
      msg: 'not bad, not bad',
      nextUrl: '/challenge4',
      hint: 'POST a file that is exactly X KiB in size, where X is the answer to the ultimate question of life, the universe, and everything',
      help: 'if you need help POSTing a file, here\'s a snippet that will help: https://gist.github.com/martinrue/f70b1e5c895e1ded8a62'
    });
  });
};

module.exports = routes;
