var db = require('../lib/db');
var events = require('../lib/events');

var routes = function(app) {
  app.get('/finish/:key', function(req, res) {
    var response = db.completeChallenge7(req.param('id'), req.param('key'));
    if (response.error) return res.json(response);

    events.add(response, response.place ? ('finished in ' + response.place + ' place') : 'finished all challenges');

    var ret = {
      msg: 'awesome – you completed all challenges'
    };

    if (response.place) ret.place = response.place;

    return res.json(ret);
  });
};

module.exports = routes;