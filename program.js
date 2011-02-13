(function(){
  var current_pattern = "",
  display = null,
  game = null,
  initial_pattern = "mwss",
  pattern = "",
  runner = {},
  running = false,
  sel = "";

  runner = function() {
    var delay_msec = 500,
    get_steps_left = null,
    set_steps_left = null,
    start = null,
    steps_left = null, // null will free run
    stop = null,
    that = {},
    timer = null,
    timeout_id = null;

    start = function(msec,steps) {
      delay_msec = msec;
      steps_left = steps;
      timer();
    };
    that.start = start;
    stop = function(){
      if (timeout_id !== null) {
        clearTimeout(timeout_id);
        timeout_id = null;
        steps_left = 0;
        running = false;
        $("#reload_button").removeAttr("disabled");
        $("#step_button").removeAttr("disabled");
        $("#run_button").html("Run");
      }
    };
    that.stop = stop;

    timer = function(){
      var number_of_live_cells = 0,
      schedule_timer = true;
      number_of_live_cells = game.step();
      if (number_of_live_cells < 1) {
        schedule_timer = false;
      }
      display.draw(game.live_cells());
      if (schedule_timer) {
        if (typeof steps_left === "number") {
          if (steps_left > 1) {
            steps_left -= 1;
          } else {
            schedule_timer = false;
          }
        }
      }
      if (schedule_timer) {
        timeout_id = setTimeout(timer,delay_msec);
      } else {
        steps_left = 0;
        running = false;
        $("#reload_button").removeAttr("disabled");
        $("#step_button").removeAttr("disabled");
        $("#run_button").html("Run");
      }
    };

    get_steps_left = function(){
      return steps_left;
    };
    that.get_steps_left = get_steps_left;
    set_steps_left = function(steps){
      steps_left = steps;
      return steps_left;
    };
    that.set_steps_left = set_steps_left;

    return that;
  }();

  game = game_of_life.new_board();
  display = game_of_life.display;
  display.set_canvas_by_id('life');

  // Set the available patterns as options on #pattern_select
  $("#pattern_select").html("");
  for (pattern in game_of_life.patterns){
    if (pattern === initial_pattern) {
      sel = ' selected=\"selected\" ';
    } else {
      sel = '';
    }
    $("#pattern_select").append('<option' + sel + '>' + pattern + '</option>');
  }

  $("#pattern_select").change(function(evt){
    current_pattern = evt.currentTarget.value;
    game.set_position_array(game_of_life.patterns[current_pattern]);
    display.draw(game.live_cells());
  });
  $("#reload_button").click(function(evt){
    if (running === false){
      game.set_position_array(game_of_life.patterns[current_pattern]);
      display.draw(game.live_cells());
    }
  });
  $("#step_button").click(function(evt){
    if (running === false){
      game.step();
      display.draw(game.live_cells());
    }
  });
  $("#run_button").click(function(evt){
    if (running) {
      running = false;
      runner.stop();
      $("#reload_button").removeAttr("disabled");
      $("#step_button").removeAttr("disabled");
      $("#run_button").html("Run");
    } else {
      running = true;
      $("#reload_button").attr("disabled","disabled");
      $("#step_button").attr("disabled","disabled");
      $("#run_button").html("Stop");
      runner.start(150,null);
    }
  });

  current_pattern = initial_pattern;
  game.set_position_array(game_of_life.patterns[current_pattern]);
  display.draw(game.live_cells());

  $("#show_game_rules").click(function(){
    $("#game_rules").css("display","block");
    $("#code_overview").css("display","none");
    $("#about_craig").css("display","none");
    $(".nav_select").removeClass("selected_notes_nav");
    $("#show_game_rules").addClass("selected_notes_nav");
  });
  $("#show_about_craig").click(function(){
    $("#game_rules").css("display","none");
    $("#code_overview").css("display","none");
    $("#about_craig").css("display","block");
    $(".nav_select").removeClass("selected_notes_nav");
    $("#show_about_craig").addClass("selected_notes_nav");
  });
  $("#show_code_overview").click(function(){
    $("#game_rules").css("display","none");
    $("#code_overview").css("display","block");
    $("#about_craig").css("display","none");
    $(".nav_select").removeClass("selected_notes_nav");
    $("#show_code_overview").addClass("selected_notes_nav");
  });
})();

