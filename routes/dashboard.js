var db = require('../lib/db');
var _ = require('underscore');

var getTeamData = function() {
  var setMustacheStageKey = function(team) {
    _.each(_.range(1, 8), function(number) {
      team['stage' + number] = team.stage === number;
    });
  };

  var data = db.getTeams();

  _.each(data.teams, function(team) {
    setMustacheStageKey(team);
    team.name = team.name.substring(0, 20);
  });

  var teams = _.sortBy(data.teams, function(team) {
    return team.stage;
  }).reverse();

  var midPoint = Math.max(Math.ceil(teams.length / 2), 3);

  var response = {
    teamsLeft: teams.slice(0, midPoint),
    teamsRight: teams.slice(midPoint),
  };

  response.noTeams = !response.teamsLeft.length && !response.teamsRight.length;
  return response;
};

var routes = function(app) {
  app.get('/', function(req, res) {
    return res.render('dashboard');
  });

  app.get('/renderteams', function(req, res) {
    return res.render('teams', getTeamData());
  });

  app.get('/keys', function(req, res) {
    var team = db.getTeam(req.param('id'));
    if (!team) return res.json({ error: 'forget your id?' });
    return res.json({ key: team.theirKey });
  });
};

module.exports = routes;