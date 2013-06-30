var moment = require('moment');
var _ = require('underscore');

var clients = [];
var maxRequestsPerMinute = 1000;

var isThrottled = function(ip) {
  var user = _.find(clients, function(client) {
    return client.ip === ip;
  });

  if (!user) {
    user = {
      ip: ip,
      requests: 0,
      resets: moment().add('minutes', 1).toDate()
    };

    clients.push(user);
  }

  if (moment().toDate() >= user.resets) {
    user.requests = 0;
    user.resets = moment().add('minutes', 1).toDate();
  }

  user.requests += 1;

  return user.requests > maxRequestsPerMinute;
};

module.exports = {
  isThrottled: isThrottled
};
