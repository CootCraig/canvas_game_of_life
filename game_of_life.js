var game_of_life = (function(){
  var that,new_board;
  that = {};
  new_board = function(){
    var board,
    cell_is_alive,
    empty_extent,
    empty_position,
    extent,
    live_cells,
    live_cell_count,
    live_neighbor_count,
    position,
    position_key_to_position,
    position_to_position_key,
    set_position_array,
    set_position_single,
    step;

    board = {};

    empty_position = function(){return {x: null, y: null};};
    position = function(x,y){
      var pos = empty_position();
      pos.x = x;
      pos.y = y;
      return pos;
    };
    empty_extent = function(){return {x_min: null, x_max: null, y_min: null, y_max: null};};
    position_key_to_position = function(key){
      var split_key = key.split(',');
      return position(parseInt(split_key[0],10),parseInt(split_key[1],10));
    };
    position_to_position_key = function(pos){
      return pos.x + ',' + pos.y;
    };

    // live_cells is an object with the live cells.
    // Property names are 'x,y'. Property value is true
    // An example with 4 live cells:
    // {'1,2': true, '2,4': true, '4,3': true, '3,1': true}
    live_cells = {}; 
    board.live_cells = function(){
      var live_arr,position_key;
      live_arr = [];
      for (position_key in live_cells) {
        if (typeof position_key === 'string') {
          live_arr.push(position_key_to_position(position_key));
        }
      }
      return live_arr;
    };
    live_cell_count = function(){
      var count=0,k;
      for (k in live_cells){
        if (typeof k === 'string'){
          count += 1;
        }
      }
      return count;
    };
    board.live_cell_count = live_cell_count;
    set_position = function(pos){ // pos.x,pos.y
      var key = null;
      if (typeof pos.x === 'number') {
        key = position_to_position_key(pos);
      } else {
        key = position_to_position_key(position(pos[0],pos[1]));
      }
      if (typeof key === 'string') {
        live_cells[key] = true;
      }
    };
    board.set_position = set_position;
    set_position_array = function(pos_array){
      var i,
      len = pos_array.length;

      for (i=0; i<len; i+=1) {
        set_position(pos_array[i]);
      }
    };
    board.set_position_array = set_position_array;

    cell_is_alive = function(pos){
      var key = position_to_position_key(pos);
      if (live_cells[position_to_position_key(pos)] === undefined) {
        return false;
      } else {
        return true;
      }
    };
    board.cell_is_alive = function(x,y) {
      return cell_is_alive(position(x,y));
    };

    live_neighbor_count = function(x,y){
      var count = 0,
      pos = empty_position();
      
      pos.x = x - 1;
      pos.y = y - 1;
      if (cell_is_alive(pos)) {
        count += 1;
      }
      pos.x = x;
      pos.y = y - 1;
      if (cell_is_alive(pos)) {
        count += 1;
      }
      pos.x = x + 1;
      pos.y = y - 1;
      if (cell_is_alive(pos)) {
        count += 1;
      }
      pos.x = x - 1;
      pos.y = y;
      if (cell_is_alive(pos)) {
        count += 1;
      }
      pos.x = x + 1;
      pos.y = y;
      if (cell_is_alive(pos)) {
        count += 1;
      }
      pos.x = x - 1;
      pos.y = y + 1;
      if (cell_is_alive(pos)) {
        count += 1;
      }
      pos.x = x;
      pos.y = y + 1;
      if (cell_is_alive(pos)) {
        count += 1;
      }
      pos.x = x + 1;
      pos.y = y + 1;
      if (cell_is_alive(pos)) {
        count += 1;
      }
      return count;
    };
    board.live_neighbor_count = live_neighbor_count;

    extent = function(){
      var ext,pos,position_key;
      ext = empty_extent();
      for (position_key in live_cells) {
        if (typeof position_key === 'string'){
          pos = position_key_to_position(position_key);
          if ((ext.x_min === null) || (ext.x_min > pos.x)) {
            ext.x_min = pos.x;
          }
          if ((ext.x_max === null) || (ext.x_max < pos.x)) {
            ext.x_max = pos.x;
          }
          if ((ext.y_min === null) || (ext.y_min > pos.y)) {
            ext.y_min = pos.y;
          }
          if ((ext.y_max === null) || (ext.y_max < pos.y)) {
            ext.y_max = pos.y;
          }
        }
      }
      return ext;
    };
    board.extent = extent;

    step = function(){
      if (live_cell_count() === 0) {
        return 0;
      }
      var board_extent = extent(),
      cell_key = '',
      is_alive = false,
      neighbor_count = 0,
      next_live_cells = {},
      pos = empty_position(),
      x = 0,
      y = 0;

      // Need to check cells just outside the current extent
      board_extent.x_min -= 1;
      board_extent.x_max += 1;
      board_extent.y_min -= 1;
      board_extent.y_max += 1;

      for (x=board_extent.x_min; x<=board_extent.x_max; x += 1) {
        for (y=board_extent.y_min; y<=board_extent.y_max; y += 1) {
          pos.x = x;
          pos.y = y;
          is_alive = false;
          neighbor_count = live_neighbor_count(x,y);
          if (cell_is_alive(pos)) {
            if ((neighbor_count === 2) || (neighbor_count === 3)) {
              is_alive = true;
            }
          } else {
            if (neighbor_count === 3) {
              is_alive = true;
            }
          }
          if (is_alive) {
            cell_key = position_to_position_key(pos);
            next_live_cells[cell_key] = true;
          }
        }
      }
      live_cells = next_live_cells;
      return live_cell_count();
    };
    board.step = step;

    return board;
  };
  that.new_board = new_board;
  return that;
}());

game_of_life.display = (function(){
  var background_style = "rgb(240,240,240)",
  border_style = "rgb(0,0,0)",
  canvas = null,
  context = null,
  draw = null,
  draw_obj = {},
  extent_from_cell_array = null,
  live_cell_style = "rgb(255,70,70)",
  set_canvas_by_id = null;

  set_canvas_by_id = function(id){
    canvas = document.getElementById(id);
	  context = canvas.getContext("2d");
  };
  draw_obj.set_canvas_by_id = set_canvas_by_id;

  draw = function(cell_array){
    var canvas_aspect_ratio = 1.0,
    canvas_center_x = 0.0,
    canvas_center_y = 0.0,
    extent = {x_min: null, x_max: null, y_min: null, y_max: null},
    extent_aspect_ratio = 1.0,
    i,
    len,
    scale = 1.0;

    extent = extent_from_cell_array(cell_array);

    canvas_aspect_ratio = canvas.width / canvas.height;
    extent_aspect_ratio = (extent.x_max - extent.x_min + 1) / (extent.y_max - extent.y_min + 1);
    coot.log('canvas_aspect_ratio=' + canvas_aspect_ratio + ' extent_aspect_ratio=' + extent_aspect_ratio);

    if (canvas_aspect_ratio >= extent_aspect_ratio) {
      // match extent y to canvas y so whole height is filled
      // center extent x on canvas x with canvas showing at left and right
      scale = canvas.height / (extent.y_max - extent.y_min + 1.0);
      canvas_center_x = (canvas.width - ((extent.x_max - extent.x_min + 1) * scale)) / 2.0;
      canvas_center_y = 0.0;
    } else {
      // match extent x to canvas x so whole width is filled
      // center extent y on canvas y with canvas showing at top and bottom
      scale = canvas.width / (extent.x_max - extent.x_min + 1.0);
      canvas_center_x = 0.0;
      canvas_center_y = (canvas.height - ((extent.y_max - extent.y_min + 1) * scale)) / 2.0;
    }
    coot.log('scale=' + scale + ' canvas_center_x=' + canvas_center_x + ' canvas_center_y=' + canvas_center_y);
    context.setTransform(1,0,0,1,0,0);
    context.fillStyle = background_style;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgb(0,0,0)";
    context.fillRect(0,0,canvas.width,4);
    context.fillRect(0,0,4,canvas.height);
    context.fillRect(0,canvas.height-4,canvas.width,4);
    context.fillRect(canvas.width-4,0,4,canvas.height);

    context.translate(canvas_center_x,canvas_center_y);
    context.scale(scale,scale);
    context.translate(-extent.x_min,-extent.y_min);

    context.fillStyle = live_cell_style;

    len = cell_array.length;
    for (i=0; i<len; i+=1){
      context.fillRect(cell_array[i].x,cell_array[i].y,0.94,0.94);
    }
  };
  draw_obj.draw = draw;

  extent_from_cell_array = function(cell_array){
    var ext = {x_min: null, x_max: null, y_min: null, y_max: null},
    i = 0,
    len = 0,
    pos,
    position_key;

    len = cell_array.length;
    for (i=0; i<len; i+=1){
      pos = cell_array[i];
      if ((ext.x_min === null) || (ext.x_min > pos.x)) {
        ext.x_min = pos.x;
      }
      if ((ext.x_max === null) || (ext.x_max < pos.x)) {
        ext.x_max = pos.x;
      }
      if ((ext.y_min === null) || (ext.y_min > pos.y)) {
        ext.y_min = pos.y;
      }
      if ((ext.y_max === null) || (ext.y_max < pos.y)) {
        ext.y_max = pos.y;
      }
    }
    coot.log('extent ' + ext.x_min + ',' + ext.y_min + ',' + ext.x_max + ',' + ext.y_max);
    return ext;
  };

  return draw_obj;
}());
