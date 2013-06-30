var events = [];

var add = function(team, message) {
  events.push({
    team: team,
    message: message
  });
};

var getNext = function(index) {
  var ev = events[index];
  return ev ? ev : false;
};

module.exports = {
  add: add,
  getNext: getNext
};
