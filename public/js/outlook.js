
App.module('Views', function (Views, App, Backbone, Marionette, $, _){

  //Outlook screen
  Views.OutlookView = Backbone.Marionette.CompositeView.extend({

    template: '#template-outlook',
    className: 'section-outlook',
    modelEvents: {
      'change': 'render'
    },

    onRender: function(){
      var self = this,
          el = this.$('.week');

      if(this.model.get('daily')) {
        _.each(this.model.get('daily').data, function(dailyForecast, i){

          var day = $(Backbone.Marionette.Renderer.render('#template-outlook-day', {
            day: moment.unix(dailyForecast.time).format('dddd'),
            high: self.model.getTemperature(dailyForecast.temperatureMax),
            low: self.model.getTemperature(dailyForecast.temperatureMin),
            chance: Math.round(dailyForecast.precipProbability * 100)
          }));

          day.find('.icon').append(self.model.getIcon(dailyForecast));
          day.find('.umbrella').append($(self.model.getSvg('Umbrella')));

          el.append(day);
        });
      }
    },

    onShow: function(){

    }

  });

});