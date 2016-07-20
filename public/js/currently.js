
App.module('Views', function (Views, App, Backbone, Marionette, $, _){

  //Currently screen
  Views.CurrentlyView = Backbone.Marionette.CompositeView.extend({

    template: '#template-currently',
    className: 'section-currently',
    modelEvents: {
      'change:currently': 'render',
      'change:scale': 'scaleChanged'
    },

    onRender: function(){
      if(this.model.get('currently') && this.model.get('hourly')) {
        this.renderSummary();
        this.$('.forecast-summary').css('opacity', 1);
        this.renderClock();
      }
    },

    onShow: function(){
      this.adjustMargins();
    },

    renderSummary: function(){
      var summaryContent = Backbone.Marionette.Renderer.render('#template-currently-stats', {
        temp: this.model.getTemperature(this.model.get('currently').temperature),
        high: this.model.getTemperature(this.model.get('daily').data[0].temperatureMax),
        low: this.model.getTemperature(this.model.get('daily').data[0].temperatureMin),
        feelsLike: this.model.getTemperature(this.model.get('currently').apparentTemperature),
        windSpeed: Math.round(this.model.get('currently').windSpeed)
      });
      this.$('.summary').html(summaryContent);
      this.$('.icon-temp .icon-wrap').append($(this.model.getIcon(this.model.get('currently'))));
    },

    renderClock: function(){
      this.dimensions = App.Util.getLayoutDimensions('.' + this.className + ' .clockface');

      this.renderClockFaceBackground(true);
      this.renderClockFaceGuides();
      this.renderTemps();
      this.renderNumbers();
      this.renderIcons();
      this.renderClockHands();
      this.adjustMargins();
    },

    renderTemps: function(){
      var self = this,
          el = this.$('.temps').empty(),
          offset = 12 - moment().format('h');

      _.each(_.first(this.model.get('hourly').data, 12), function(hourlyForecast, i){
        var coords = App.Util.makePoint(30, ((i-offset)+0.5)*5, 0, (self.dimensions.radius/1.2)),
            temp = $('<p />')
            .addClass('temp')
            .html(self.model.getTemperature(hourlyForecast.temperature) + '&deg;')
            .css({
              'left': coords.ex + 'px',
              'top': coords.ey + 'px'
            });

        el.append(temp);

      });
    },

    renderIcons: function(){
      var self = this,
          el = this.$('.icons'),
          offset = 12 - moment().format('h');

      _.each(_.first(this.model.get('hourly').data, 12), function(hourlyForecast, i){
        var coords = App.Util.makePoint(30, ((i-offset)+0.5)*5, 0, (self.dimensions.radius * 0.53)),
            icon = $(self.model.getIcon(hourlyForecast))
            .css({
              'left': coords.ex + 'px',
              'top': coords.ey + 'px'
            });
// console.log(hourlyForecast);
        icon.addClass('icon');

        el.append(icon);
      });
    },

    scaleChanged: function(){
      if(this.model.get('currently') && this.model.get('hourly')) {
        this.renderTemps();
        this.adjustMargins();
        this.renderSummary();
      }
    }

  }).mixin([App.Mixin.clockMixins]);

});