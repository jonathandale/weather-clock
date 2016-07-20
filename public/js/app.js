

var App = new Backbone.Marionette.Application();

App.routes = ['currently', 'precipitation', 'outlook'];

App.addRegions({
  status: '#status',
  main: '#main',
  navigation: '#navigation'
});

App.on('start', function(){
  var hash = window.location.hash,
      initialSection = (hash.length) ? hash.replace('#', '') : _.first(App.routes);

  if(Backbone.history) {
    Backbone.history.start();
    Backbone.history.navigate(initialSection, {trigger:true});
  }
});