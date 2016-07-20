
App.module('Nimbus', function (Nimbus, App, Backbone, Marionette, $, _){

  //Nimbus router
  Nimbus.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'currently': 'showCurrently',
      'precipitation': 'showPrecipitation',
      'outlook': 'showOutlook'
    },

    onRoute: function(name, path){
      App.vent.trigger('onRoute', path);
    }
  });

  //Nimbus Controller
  Nimbus.Controller = function(){
    var forecasts = this.forecasts = new App.Forecasts.Forecast();
    //Listen to scale change
    App.vent.on('scale-change', function(scale){
      forecasts.set('scale', scale);
    });
  };

  _.extend(Nimbus.Controller.prototype, {

    start: function(){
      // var lat = '45.5118',
      //     lng = '-122.6756';
      var lat = App.Util.getUrlParam('lat'),
          lng = App.Util.getUrlParam('lng');

      this.renderLayouts();
      this.showStatus('pulse');
      if(lat && lng) {
        App.status.empty();
        this.getForecast({
          coords: {
            latitude: lat,
            longitude: lng,
          }
        });
      }
      else {
        this.getUserLocation();
      }
    },

    renderLayouts: function(){
      var self = this,
          regions = {};

      //Disable touchmove to stop bounce scrolling
      document.ontouchmove = function(e){
        e.preventDefault();
      };

      _.each(App.routes, function(route){
        regions[route+'Region'] = '.'+route;
      });

      //TODO: Consider passing regions from the App.routes array
      this.mainView = new App.Layout.Main({
        model: this.forecasts,
        regions: regions
      });

      App.navigation.show(new App.Layout.Navigation());
      App.main.show(this.mainView);
      this.finger = new Finger(document.getElementById('main'), {
        duration: 500,
        onchange: function(idx){
          Backbone.history.navigate(App.routes[idx], {trigger:false});
          App.vent.trigger('onRoute', App.routes[idx]);
        }
      });
    },

    //Location related
    getUserLocation: function() {
      var self = this;

      navigator.geolocation.getCurrentPosition(
        function(position){
          App.status.empty();
          self.getForecast(position);
        },
        function(){
          self.locationRejected();
        }
      );
    },

    locationRejected: function(){
      this.showStatus('rejected');
    },

    showStatus: function(className, message){
      App.status.show(new App.Layout.Status({template: '#template-status', message: message, className: className}));
    },

    //forecast related
    getForecast: function(position){
      this.forecasts.fetch({
        url: '/forecast/?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude
      }).then(function(f){});
    },

    showCurrently: function(){
      this.finger.show(0);
    },

    showPrecipitation: function(){
      this.finger.show(1);
    },

    showOutlook: function(){
      this.finger.show(2);
    }


  });

  Nimbus.addInitializer(function(){
    var controller = new Nimbus.Controller();

    controller.router = new Nimbus.Router({
      controller: controller
    });

    controller.start();
  });

});
