var fs = require('fs');
var crypto = require('crypto');
var _ = require('underscore');

var data = { teams: [] };
var dataFile = 'database';

var createId = function() {
  return (Math.round(Math.random() * 100000000)).toString(36);
};

var getGravatarUrl = function(email) {
  var hash = crypto.createHash('md5').update(email).digest('hex');
  return 'http://www.gravatar.com/avatar/' + hash;
};

var save = function() {
  fs.writeFileSync(dataFile, JSON.stringify(data));
};

var load = function() {
  if (!fs.existsSync(dataFile)) return;
  data = JSON.parse(fs.readFileSync(dataFile));
};

var killTeam = function(id) {
  data.teams = _.reject(data.teams, function(team) {
    return team.id === id && !team.valid;
  });

  save();
};

var registerTeam = function(name, email) {
  if (!name) return { error: 'a team needs a name, you know?' };
  if (!email) return { error: 'a team needs an email' };

  var duplicate = _.some(data.teams, function(team) {
    return team.name.toLowerCase() === name || team.email.toLowerCase() === email;
  });

  if (duplicate) {
    return { error: 'team already exists' };
  }

  var team = {
    name: name,
    email: email,
    id: createId(),
    gravatar: getGravatarUrl(email),
    valid: false
  };

  data.teams.push(team);
  save();
  return team;
};

var validateTeam = function(id) {
  if (!id) return { error: 'I need to know the id of the team to validate' };

  var team = _.findWhere(data.teams, { id: id });
  if (!team) return { error: 'too slow – register again and move your ass' };

  return {};
};

var getData = function() {
  return data;
};

load();

module.exports = {
  load: load,
  getData: getData,
  registerTeam: registerTeam,
  validateTeam: validateTeam,
  killTeam: killTeam
};
