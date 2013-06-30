var db = require('../lib/db');
var events = require('../lib/events');

var routes = function(app) {
  app.post('/challenge4', function(req, res) {
    if (!req.files.file) return res.json({ error: 'no file was POSTed for key `file`' });
    if (req.files.file.size === 42 * 1000) return res.json({ error: 'KiB?' });
    if (req.files.file.size !== 42 * 1024) return res.json({ error: 'file is the wrong size' });

    var response = db.completeChallenge4(req.body && req.body.id);
    if (response.error) return res.json(response);

    events.add(response, 'Has POSTed their way to challenge 5');

    return res.json({ nextUrl: '/js/fixme.js' });
  });
};

module.exports = routes;