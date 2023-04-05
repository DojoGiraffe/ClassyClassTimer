// Load the XML schedule file and parse it
$.ajax({
  url: "class_schedule.xml",
  dataType: "xml",
  success: function(xml) {
    // Find all class periods in the XML and store them in an array
    var periods = [];
    $(xml).find("class_period").each(function() {
      var name = $(this).attr("name");
      var start_time = $(this).attr("start_time");
      var end_time = $(this).attr("end_time");
      periods.push({name: name, start_time: start_time, end_time: end_time});
    });

    // Calculate the time remaining in the current class period
    var current_period = getCurrentPeriod(periods);
    var time_remaining = getTimeRemaining(current_period.start_time, current_period.end_time);

    // Update the timer display
    updateTimerDisplay(time_remaining);

    // Start the countdown timer
    setInterval(function() {
      time_remaining -= 1;
      if (time_remaining <= 0) {
        // If the current period has ended, calculate the time remaining in the next period
        current_period = getNextPeriod(periods);
        time_remaining = getTimeRemaining(current_period.start_time, current_period.end_time);
      }
      updateTimerDisplay(time_remaining);
    }, 1000);
  },
  error: function() {
    alert("Error loading schedule file");
  }
});

// Get the current class period based on the current time
function getCurrentPeriod(periods) {
  var now = new Date();
  for (var i = 0; i < periods.length; i++) {
    var start_time = new Date("2000-01-01T" + periods[i].start_time + ":00");
    var end_time = new Date("2000-01-01T" + periods[i].end_time + ":00");
    if (now >= start_time && now < end_time) {
      return periods[i];
    }
  }
  return null;
}

// Get the next class period based on the current time
function getNextPeriod(periods) {
  var now = new Date();
  for (var i = 0; i < periods.length; i++) {
    var start_time = new Date("2000-01-01T" + periods[i].start_time + ":00");
    var end_time = new Date("2000-01-01T" + periods[i].end_time + ":00");
    if (now < start_time) {
      return periods[i];
    }
  }
  return periods[0];
}

// Calculate the time remaining between the start and end times in seconds
function getTimeRemaining(start_time, end_time) {
  var now = new Date();
  var start = new Date("2000-01-01T" + start_time + ":00");
  var end = new Date("2000-01-01T" + end_time + ":00");
  var diff = end - now;
  if (diff < 0) {
    return 0;
  }
  return Math.floor(diff / 1000);
}

// Update the timer display with the time remaining in minutes and seconds
function updateTimerDisplay(time_remaining) {
  var minutes = Math.floor(time_remaining / 60);
  var seconds = time_remaining % 60;
  var display_string = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  $("#timer").text(display_string);
}
