var moment = require('moment');
var _ = require('underscore');

var clients = [];
var maxRequestsPerMinute = 10;
var on = false;

var isThrottled = function(ip) {
  if (!on) return false;

  var user = _.find(clients, function(client) {
    return client.ip === ip;
  });

  if (!user) {
    user = {
      ip: ip,
      requests: 0,
      resets: moment().add('minutes', 2).toDate()
    };

    clients.push(user);
  }

  if (moment().toDate() >= user.resets) {
    user.requests = 0;
    user.resets = moment().add('minutes', 2).toDate();
  }

  user.requests += 1;

  return user.requests > maxRequestsPerMinute;
};

var enable = function() {
  on = true;
};

module.exports = {
  isThrottled: isThrottled,
  enable: enable
};
