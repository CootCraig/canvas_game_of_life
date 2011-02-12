
acorn = [
  [-2,-1],
  [0,0],
  [-3,1],
  [-2,1],
  [1,1],
  [2,1],
  [3,1]
];
test = [
  [1,1],
  [10,1],
  [10,10],
  [1,10]
];
g = game_of_life.new_board();
d = game_of_life.display;
g.set_position_array(acorn);
d.set_canvas_by_id('life');
d.draw(g.live_cells());
