var db = require('../lib/db');
var events = require('../lib/events');
var apithrottle = require('../lib/apithrottle');

var routes = function(app) {
  app.get('/finish/:key', function(req, res) {
    var throttled = apithrottle.isThrottled(req.connection.remoteAddress);
    if (throttled) return res.json({ error: 'exceeded limit of 1000 request per minute' });

    var response = db.completeChallenge7(req.param('id'), req.param('key'));
    if (response.error) return res.json(response);

    events.add(response, response.place ? ('Finished in ' + response.place + ' place') : 'Finished all challenges');

    var json = {
      msg: 'awesome – you completed all challenges'
    };

    if (response.place) json.place = response.place;

    return res.json(json);
  });
};

module.exports = routes;