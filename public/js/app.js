eventBeingShown = false;

var loadTeams = function() {
  $('#teams').load('/renderteams');
};

var showNextEvent = function() {
  var showEvent = function(ev) {
    if (eventBeingShown) return;

    $('.modal').modal('show');
    $('.modal h3').html(ev.team.name);
    $('.modal h4').html(ev.message);
    $('.modal img').attr('src', ev.team.gravatar);
  };

  $.get('/event/' + localStorage['eventIndex'], function(ev) {
    ev ? showEvent(ev) : setTimeout(showNextEvent, 3000);
  });
};

localStorage['eventIndex'] = localStorage['eventIndex'] || 0;

$(function() {
  $('.modal').on('shown', function () {
    eventBeingShown = true;
    setTimeout(function() { $('.modal').modal('hide'); }, 10000);
  });

  $('.modal').on('hidden', function () {
    eventBeingShown = false;
    localStorage['eventIndex']++;
    setTimeout(showNextEvent, 3000);
  });

  setInterval(loadTeams, 1000);
  setTimeout(showNextEvent, 3000);
});

// all your base64 are belong to us
// L2JlY29tZV90aGVfc2Fib3RldXI=
