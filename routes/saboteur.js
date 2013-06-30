var net = require('net');
var crypto = require('crypto');
var db = require('../lib/db');
var events = require('../lib/events');

var saboteurPort = 30581;

var routes = function(app) {
  app.get('/become_the_saboteur', function(req, res) {
    if (db.saboteurExists()) return res.json({ error: 'saboteur already exists' });

    var id = req.param('id');
    if (!id) return res.json({ error: 'without an id I have no idea who you are' });

    var team = db.getTeam(id);
    if (!team) return res.json({ error: 'invalid team id' });

    events.add(team, 'Is attempting to become the saboteur');

    var port = crypto.createHash('md5').update(saboteurPort.toString()).digest('hex');

    return res.json({
      msg: 'connect to the TCP port ' + port + ' and send your team id',
      hint: 'you are seeing an MD5 hash of the real port number, work out what the real port number is'
    });
  });

  app.get('/sabotage/92hgd6s/:name', function(req, res) {
    return res.send('team to ban: ' + req.param('name'));
  });
};

var server = net.createServer(function(socket) {
  socket.on('data', function(id) {
    socket.end(db.makeTeamTheSaboteur(id.toString()));
  });
});

server.listen(saboteurPort);

module.exports = routes;