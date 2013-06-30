var fs = require('fs');
var crypto = require('crypto');
var _ = require('underscore');
var events = require('./events');

var data = { teams: [] };
var dataFile = 'database';

var createId = function() {
  return (Math.round(Math.random() * 1000000000)).toString(36);
};

var createKey = function() {
  return Math.round(Math.random() * 9999);
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
  clean();
};

var clean = function() {
  data.teams = _.reject(data.teams, function(team) {
    return !team.valid;
  });

  save();
};

var killTeam = function(id, valid) {
  var team = _.findWhere(data.teams, { id: id, valid: false });

  if (team) {
    events.add(team, 'Has been eliminated!');
  }

  data.teams = _.reject(data.teams, function(team) {
    return team.id === id && team.valid === valid;
  });

  save();
};

var getTeam = function(id) {
  return _.findWhere(data.teams, { id: id });
};

var getTeams = function() {
  return data;
};

var registerTeam = function(name, email) {
  if (!name) return { error: 'a team needs a name, you know?' };
  if (!email) return { error: 'a team needs an email' };

  var duplicate = _.some(data.teams, function(team) {
    return team.name.toLowerCase() === name.toLowerCase() || team.email.toLowerCase() === email.toLowerCase();
  });

  if (duplicate) {
    return { error: 'team already exists' };
  }

  var team = {
    name: name.trim(),
    email: email.trim(),
    id: createId(),
    gravatar: getGravatarUrl(email.trim()),
    valid: false,
    stage: 1
  };

  data.teams.push(team);
  save();
  return team;
};

var validateTeam = function(id) {
  if (!id) return { error: 'no id, no validate' };

  var team = _.findWhere(data.teams, { id: id });
  if (!team) return { error: 'too slow – register again and move your ass' };

  team.valid = true;
  team.stage = 2;
  save();
  return team;
};

var completeChallenge2 = function(id) {
  if (!id) return { error: 'without an id I can\'t help you' };

  var team = _.findWhere(data.teams, { id: id });
  if (!team) return { error: 'I don\'t know who you stole that id from, but it doesn\'t refer to a team' };

  if (team.stage < 2) return { error: 'complete stage 1 first – cheater' };

  team.stage = 3;
  save();
  return team;
};

var completeChallenge3 = function(id) {
  if (!id) return { error: 'you must think I\'m psychic – without an id I have no idea who you are' };

  var team = _.findWhere(data.teams, { id: id });
  if (!team) return { error: 'I don\'t know who you stole that id from, but it doesn\'t refer to a team' };

  if (team.stage < 3) return { error: 'complete stage 2 first – cheater' };

  team.stage = 4;
  save();
  return team;
};

var completeChallenge4 = function(id) {
  if (!id) return { error: 'you must think I\'m psychic – without an id I have no idea who you are' };

  var team = _.findWhere(data.teams, { id: id });
  if (!team) return { error: 'I don\'t know who you stole that id from, but it doesn\'t refer to a team' };

  if (team.stage < 4) return { error: 'complete stage 3 first – cheater' };

  team.stage = 5;
  save();
  return team;
};

var completeChallenge5 = function(id) {
  if (!id) return { error: 'you must think I\'m psychic – without an id I have no idea who you are' };

  var team = _.findWhere(data.teams, { id: id });
  if (!team) return { error: 'I don\'t know who you stole that id from, but it doesn\'t refer to a team' };

  if (team.stage < 5) return { error: 'complete stage 4 first – cheater' };

  team.stage = 6;
  save();
  return team;
};

var completeChallenge6 = function(id) {
  if (!id) return { error: 'you must think I\'m psychic – without an id I have no idea who you are' };

  var team = _.findWhere(data.teams, { id: id });
  if (!team) return { error: 'I don\'t know who you stole that id from, but it doesn\'t refer to a team' };

  if (team.stage < 6) return { error: 'complete stage 5 first – cheater' };

  team.stage = 7;
  save();
  return team;
};

var completeChallenge7 = function(id, key) {
  if (!id) return { error: 'you must think I\'m psychic – without an id I have no idea who you are' };

  var team = _.findWhere(data.teams, { id: id });
  if (!team) return { error: 'I don\'t know who you stole that id from, but it doesn\'t refer to a team' };

  if (team.key.toString() !== key) return { error: 'incorrect key' };

  if (team.stage < 7) return { error: 'complete stage 6 first – cheater' };

  rankTeam(id);
  save();
  return team;
};

var generateKey = function(team) {
  var key = createKey();
  var teamsWithoutKey = _.where(data.teams, { theirKey: undefined });

  var teams = _.reject(teamsWithoutKey, function(t) {
    return t.id === team.id;
  });

  var teamName;

  if (teams.length === 0) {
    team.theirKey = key;
    teamName = team.name;
  } else {
    var teamIndex = Math.floor(Math.random() * teams.length);
    teams[teamIndex].theirKey = key;
    teamName = teams[teamIndex].name;
  }

  team.key = key;
  team.teamWithKey = teamName;
  save();
  return teamName;
};

var rankTeam = function(id) {
  var team = _.findWhere(data.teams, { id: id });
  if (!team) return;

  var first = !!_.findWhere(data.teams, { place: '1st' });
  var second = !!_.findWhere(data.teams, { place: '2nd' });
  var third = !!_.findWhere(data.teams, { place: '3rd' });

  var result = !first ? { p: '1st', t: 'gold' } : !second ? { p: '2nd', t: 'silver' } : !third ? { p: '3rd', t: 'bronze' } : { p: '', t: '' };

  team.place = result.p;
  team.trophy = result.t;
  team.medal = result.p === '';

  team.stage = result.p === '1st' ? 100 : result.p === '2nd' ? 99 : result.p === '3rd' ? '98' : 97;
  save();
};

var makeTeamTheSaboteur = function(id) {
  var team = _.findWhere(data.teams, { id: id.trim() });
  if (!team) return 'could not find team for id ' + id + '\r\n';

  team.saboteur = true;
  save();

  events.add(team, 'Has become the saboteur');

  return '\r\nYou are now the saboteur\r\nGET /sabotage/92hgd6s/<team name> to use your sabotage against <team name>\r\nSabotaging a team causes them to be blocked from the server for 5 minutes\r\n\r\n';
};

var saboteurExists = function() {
  return _.some(data.teams, function(team) {
    return team.saboteur;
  });
};

load();

module.exports = {
  load: load,
  getTeam: getTeam,
  getTeams: getTeams,
  registerTeam: registerTeam,
  validateTeam: validateTeam,
  completeChallenge2: completeChallenge2,
  completeChallenge3: completeChallenge3,
  completeChallenge4: completeChallenge4,
  completeChallenge5: completeChallenge5,
  completeChallenge6: completeChallenge6,
  completeChallenge7: completeChallenge7,
  generateKey: generateKey,
  rankTeam: rankTeam,
  makeTeamTheSaboteur: makeTeamTheSaboteur,
  saboteurExists: saboteurExists,
  killTeam: killTeam
};