
App.module('Util', function (Util, App, Backbone, Marionette, $, _){

  Util.getLayoutDimensions = _.memoize(function(container) {
    container = container || window;

    var fullWidth = $(container).width(),
        fullHeight = $(container).height(),
        layoutDimensions = {},
        padding = 20,
        availableWidth, availableHeight, shorterSide;

    layoutDimensions.fullWidth = fullWidth;
    layoutDimensions.fullHeight = fullHeight;

    //Work out available height
    // availableHeight = Math.round($('.forecast-summary').position().top);
    availableHeight = fullHeight;

    //Work out available width
    availableWidth = fullWidth;

    //Use whichever is the shorter distance for the width & height of the clock
    shorterSide = (availableWidth < availableHeight) ? availableWidth : availableHeight;


    layoutDimensions.radius = Math.round((shorterSide - (padding * 2)) / 2);
    layoutDimensions.diameter = Math.round(shorterSide - (padding * 2));

    //Work out x & y coordinates
    layoutDimensions.x = Math.round(availableWidth / 2);
    layoutDimensions.y = Math.round(availableHeight / 2);

    return layoutDimensions;
  });

  //Make a point and return coordinates
  Util.makePoint = function(division, amount, from, to){
    var angle, sangle, cangle;

    angle = -Math.PI/division * (amount);
    sangle = Math.sin(angle);
    cangle = Math.cos(angle);

    return {
      sx: -(sangle * from),
      sy: -(cangle * from),
      ex: -(sangle * to),
      ey: -(cangle * to)
    };
  };

  //Capitalize
  Util.Capitalize = function(word){
    return word.charAt(0).toUpperCase() + word.substring(1);
  };

  Util.getUrlParam = function(variable){
    var query = window.location.search.substring(1),
        vars = query.split("&");

    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if(pair[0] == variable){return pair[1];}
    }

    return(false);
  };

});