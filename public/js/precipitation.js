App.module('Views', function (Views, App, Backbone, Marionette, $, _){

  //Precipitation screen
  Views.PrecipitationView = Backbone.Marionette.CompositeView.extend({
    template: '#template-precipitation',
    className: 'section-precipitation',

    modelEvents: {
      'change': 'render'
    },

    defaultDisplayUnit: 'hourly',
    displayUnit: 'hourly',

    serializeData: function(){
      return {
        hourly: this.model.get('hourly'),
        minutely: this.model.get('minutely')
      };
    },

    events: {
      'click .unit': 'toggle'
    },

    onRender: function(){
      //If there isn't data for the intended display unit, reset to the default.
      if(!!this.model.get(this.displayUnit)) this.displayUnit = this.defaultDisplayUnit;

      if(this.model.get('hourly')) {
        this.$('.forecast-summary').css('opacity', 1);
        this.renderClock();
        this.renderMain();
      }
    },

    onShow: function(){
      this.adjustMargins();
    },

    renderMain: function(){
      var now = _.first(this.model.get(this.displayUnit).data);
      this.$('.chance').html(Math.round(now.precipProbability * 100) + '<span>%</span>');
      this.renderSummary(now);
    },

    renderSummary: function(now){
      var self = this,
          template = Backbone.Marionette.Renderer.render('#template-precipitation-summary', {
            type: now.precipType || _.first(this.model.get(this.defaultDisplayUnit).data).precipType || 'rain',
            timeUnit: self.displayUnit.substring(0, self.displayUnit.length-2)
          });
      this.$('.summary').empty().append(template);
    },

    renderClock: function(){
      this.dimensions = App.Util.getLayoutDimensions('.' + this.className + ' .clockface');

      this.renderClockFaceBackground();
      this.renderMidPointCircle();
      this.renderSegments();
      this.renderClockFaceGuides();
      this.renderNumbers();
      this.renderClockHands();
      this.adjustMargins();
    },

    renderSegments: function(){
      var self = this,
          unit = {
            minutely: {
              angle: Math.PI/30,
              data: this.model.get('minutely') ? this.model.get('minutely').data : null,
              offsetFlag: 'm',
              offsetStart: 29
            },
            hourly: {
              angle: Math.PI/6,
              data: this.model.get('minutely') ? _.first(this.model.get('hourly').data, 12) : null,
              offsetFlag: 'h',
              offsetStart: 5
            }
          },
          segmentsEl = this.$('.segments').empty(),
          startFrom = this.dimensions.radius/13,
          fullDistance = (this.dimensions.radius * 0.91) - startFrom,
          offset = moment().format(unit[this.displayUnit].offsetFlag),
          segmentsSVG, segments;

      segmentsSVG = new Two({width:this.dimensions.fullWidth, height:this.dimensions.fullHeight}).appendTo(segmentsEl[0]);

      segments = segmentsSVG.makeGroup();

      _.each(unit[this.displayUnit].data, function(timeUnit, i){
        var distance = Math.round(startFrom + (fullDistance * timeUnit.precipProbability)),
            angle = unit[self.displayUnit].angle,
            segment;

        if(distance > startFrom) {
          segment = segmentsSVG.makeArcSegment(0, 0, startFrom, distance, 0, angle);
          segment.rotation = -(angle * unit[self.displayUnit].offsetStart) + (i * angle) + (offset * angle);
          segments.add(segment);
        }
      });

      segments.noStroke();
      segments.fill = '#000000';
      segments.opacity = 0.35;
      segments.translation.set(segmentsSVG.width/2, segmentsSVG.height/2);

      segmentsSVG.update();
    },

    renderMidPointCircle: function(){
      var dashedCircle = $('<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><path d="M48.7,99.8c-0.9,0-1.8-0.1-2.6-0.1l0-0.5c0.9,0.1,1.7,0.1,2.6,0.1L48.7,99.8z M51.4,99.7l0-0.5c0.9,0,1.7-0.1,2.6-0.1l0,0.5  C53.1,99.7,52.3,99.7,51.4,99.7z M43.5,99.3c-0.9-0.1-1.8-0.3-2.6-0.4l0.1-0.5c0.9,0.2,1.7,0.3,2.6,0.4L43.5,99.3z M56.7,99.3  l-0.1-0.5c0.9-0.1,1.7-0.3,2.6-0.4l0.1,0.5C58.4,99.1,57.5,99.2,56.7,99.3z M38.3,98.4c-0.9-0.2-1.7-0.4-2.6-0.7l0.1-0.4  c0.8,0.3,1.7,0.5,2.5,0.7L38.3,98.4z M61.9,98.3l-0.1-0.5c0.8-0.2,1.7-0.4,2.5-0.7l0.1,0.4C63.6,97.9,62.7,98.1,61.9,98.3z   M33.2,96.8c-0.8-0.3-1.7-0.6-2.5-1l0.2-0.4c0.8,0.3,1.6,0.7,2.4,1L33.2,96.8z M66.9,96.8l-0.2-0.4c0.8-0.3,1.6-0.6,2.4-1l0.2,0.4  C68.6,96.2,67.8,96.5,66.9,96.8z M28.3,94.8c-0.8-0.4-1.6-0.8-2.4-1.2l0.2-0.4c0.8,0.4,1.5,0.8,2.3,1.2L28.3,94.8z M71.8,94.7  l-0.2-0.4c0.8-0.4,1.6-0.8,2.3-1.2l0.2,0.4C73.4,93.9,72.6,94.3,71.8,94.7z M23.7,92.2c-0.7-0.5-1.5-1-2.2-1.5l0.3-0.4  c0.7,0.5,1.5,1,2.2,1.5L23.7,92.2z M76.4,92.1l-0.2-0.4c0.7-0.5,1.5-1,2.2-1.5l0.3,0.4C77.9,91.2,77.1,91.7,76.4,92.1z M19.3,89.1  c-0.7-0.5-1.4-1.1-2-1.7l0.3-0.4c0.7,0.6,1.3,1.2,2,1.7L19.3,89.1z M80.7,89.1l-0.3-0.4c0.7-0.5,1.4-1.1,2-1.7l0.3,0.4  C82.1,87.9,81.4,88.5,80.7,89.1z M15.3,85.6c-0.6-0.6-1.2-1.3-1.8-1.9l0.3-0.3c0.6,0.6,1.2,1.3,1.8,1.9L15.3,85.6z M84.7,85.5  l-0.3-0.3c0.6-0.6,1.2-1.2,1.8-1.9l0.3,0.3C86,84.3,85.3,84.9,84.7,85.5z M11.7,81.7c-0.6-0.7-1.1-1.4-1.6-2.1l0.4-0.3  c0.5,0.7,1.1,1.4,1.6,2.1L11.7,81.7z M88.3,81.6l-0.4-0.3c0.5-0.7,1.1-1.4,1.6-2.1l0.4,0.3C89.4,80.2,88.9,80.9,88.3,81.6z   M8.6,77.4c-0.5-0.7-1-1.5-1.4-2.3l0.4-0.2C8,75.6,8.5,76.4,9,77.1L8.6,77.4z M91.5,77.3l-0.4-0.3c0.5-0.7,0.9-1.5,1.4-2.2l0.4,0.2  C92.4,75.8,91.9,76.6,91.5,77.3z M5.9,72.8c-0.4-0.8-0.8-1.6-1.2-2.4l0.4-0.2c0.4,0.8,0.7,1.6,1.2,2.4L5.9,72.8z M94.2,72.7  l-0.4-0.2c0.4-0.8,0.8-1.6,1.1-2.4l0.4,0.2C95,71.1,94.6,71.9,94.2,72.7z M3.7,68c-0.3-0.8-0.6-1.7-0.9-2.5l0.4-0.1  c0.3,0.8,0.6,1.7,0.9,2.5L3.7,68z M96.4,67.9l-0.4-0.2c0.3-0.8,0.6-1.7,0.9-2.5l0.4,0.1C97,66.2,96.7,67,96.4,67.9z M2,62.9  c-0.2-0.8-0.4-1.7-0.6-2.6l0.5-0.1c0.2,0.9,0.4,1.7,0.6,2.6L2,62.9z M98,62.8l-0.4-0.1c0.2-0.8,0.4-1.7,0.6-2.6l0.5,0.1  C98.5,61.1,98.2,61.9,98,62.8z M0.9,57.7c-0.1-0.9-0.3-1.8-0.4-2.6L1,55c0.1,0.9,0.2,1.8,0.4,2.6L0.9,57.7z M99.1,57.6l-0.5-0.1  c0.1-0.9,0.3-1.8,0.3-2.6l0.5,0C99.4,55.8,99.3,56.7,99.1,57.6z M0.3,52.4c0-0.9-0.1-1.8-0.1-2.7l0.5,0c0,0.9,0,1.8,0.1,2.6  L0.3,52.4z M99.7,52.3l-0.5,0c0-0.9,0.1-1.8,0.1-2.6v-0.2h0.5v0.2C99.8,50.5,99.7,51.4,99.7,52.3z M0.8,47.1l-0.5,0  c0-0.9,0.1-1.8,0.2-2.7l0.5,0C0.9,45.3,0.8,46.2,0.8,47.1z M99.2,46.7c0-0.9-0.1-1.8-0.2-2.6l0.5-0.1c0.1,0.9,0.2,1.8,0.2,2.7  L99.2,46.7z M1.3,41.8l-0.5-0.1C1,40.8,1.2,40,1.3,39.1l0.5,0.1C1.6,40,1.4,40.9,1.3,41.8z M98.6,41.5c-0.1-0.9-0.3-1.8-0.5-2.6  l0.5-0.1c0.2,0.9,0.4,1.7,0.5,2.6L98.6,41.5z M2.4,36.6L2,36.5c0.2-0.9,0.5-1.7,0.8-2.6l0.4,0.1C2.9,34.9,2.6,35.8,2.4,36.6z   M97.5,36.3c-0.2-0.8-0.5-1.7-0.8-2.5l0.4-0.1c0.3,0.8,0.5,1.7,0.8,2.6L97.5,36.3z M4,31.6l-0.4-0.2c0.3-0.8,0.7-1.7,1-2.5l0.4,0.2  C4.7,30,4.4,30.8,4,31.6z M95.8,31.3c-0.3-0.8-0.7-1.6-1-2.4l0.4-0.2c0.4,0.8,0.7,1.6,1,2.5L95.8,31.3z M6.2,26.8l-0.4-0.2  c0.4-0.8,0.8-1.6,1.3-2.3l0.4,0.2C7,25.2,6.6,26,6.2,26.8z M93.7,26.5c-0.4-0.8-0.8-1.6-1.3-2.3l0.4-0.2c0.4,0.8,0.9,1.5,1.3,2.3  L93.7,26.5z M8.9,22.2l-0.4-0.3c0.5-0.7,1-1.5,1.5-2.2l0.4,0.3C9.9,20.7,9.3,21.5,8.9,22.2z M91,22c-0.5-0.7-1-1.5-1.5-2.2l0.4-0.3  c0.5,0.7,1,1.4,1.5,2.2L91,22z M12,18l-0.4-0.3c0.6-0.7,1.1-1.4,1.7-2l0.3,0.3C13.1,16.6,12.5,17.3,12,18z M87.8,17.7  c-0.6-0.7-1.1-1.3-1.7-2l0.3-0.3c0.6,0.7,1.2,1.3,1.8,2L87.8,17.7z M15.5,14.1l-0.3-0.3c0.6-0.6,1.3-1.2,1.9-1.8l0.3,0.3  C16.8,12.8,16.2,13.4,15.5,14.1z M84.3,13.9c-0.6-0.6-1.3-1.2-1.9-1.8l0.3-0.4c0.7,0.6,1.3,1.2,2,1.8L84.3,13.9z M19.5,10.6  l-0.3-0.4c0.7-0.5,1.4-1.1,2.1-1.6L21.6,9C20.9,9.5,20.2,10,19.5,10.6z M80.3,10.4c-0.7-0.5-1.4-1.1-2.1-1.6l0.3-0.4  c0.7,0.5,1.4,1,2.1,1.6L80.3,10.4z M23.8,7.5l-0.2-0.4c0.7-0.5,1.5-0.9,2.3-1.4L26,6.2C25.2,6.6,24.5,7,23.8,7.5z M76,7.4  c-0.7-0.5-1.5-0.9-2.3-1.3L74,5.6C74.7,6,75.5,6.5,76.3,7L76,7.4z M28.3,4.9l-0.2-0.4c0.8-0.4,1.6-0.8,2.4-1.1l0.2,0.4  C29.9,4.2,29.1,4.6,28.3,4.9z M71.4,4.8c-0.8-0.4-1.6-0.7-2.4-1.1l0.2-0.4C70,3.6,70.8,4,71.6,4.4L71.4,4.8z M33.1,2.9L33,2.4  c0.8-0.3,1.7-0.6,2.5-0.8L35.6,2C34.8,2.3,34,2.6,33.1,2.9z M66.6,2.8c-0.8-0.3-1.7-0.6-2.5-0.8l0.1-0.4C65,1.7,65.9,2,66.7,2.3  L66.6,2.8z M38.2,1.3L38,0.9c0.9-0.2,1.7-0.4,2.6-0.6l0.1,0.5C39.9,0.9,39,1.1,38.2,1.3z M61.5,1.3c-0.8-0.2-1.7-0.4-2.6-0.5  l0.1-0.5c0.9,0.2,1.7,0.3,2.6,0.6L61.5,1.3z"/></svg>'),
          radius = (((this.dimensions.radius * 0.91) - (this.dimensions.radius * 0.25)) / 2) + (this.dimensions.radius * 0.26),
          label = $('<p><span>50%</span></p>').addClass('label');

      dashedCircle.css({
        'width': (radius * 2) + 'px',
        'height': (radius * 2) + 'px',
        'fill':'#ff8c1c'
      });

      this.$('.dashed').html(dashedCircle).css({
        'top': (this.dimensions.fullHeight/2)-radius + 'px'
      });


      this.$('.dashed').append(label);

    },

    toggle: function(e){
      var currentEl = $(e.currentTarget).find('.active').removeClass('active'),
          current = currentEl.attr('class'),
          future = (current === 'hour') ? 'minute' : 'hour';

      this.displayUnit = (current === 'hour') ? 'minutely' : 'hourly';
      $(e.currentTarget).find('.' + future).addClass('active');

      this.renderMain();
      this.renderSegments();
    }

  }).mixin([App.Mixin.clockMixins]);

});