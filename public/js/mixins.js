
App.module('Mixin', function (Mixin, App, Backbone, Marionette, $, _, advice, Two){

  //Add Marionette mixins
  advice.addMixin(Backbone.Marionette.CompositeView);

  Mixin.clockMixins = function(){
    this.clobber({
      renderClockFaceBackground: function(includeOuter){
        var clockfaceEl = this.$('.background')[0],
            circles, cfb, innerCircle, outerCircle;

        cfb = this.cfBackground = new Two({width:this.dimensions.fullWidth, height:this.dimensions.fullHeight}).appendTo(clockfaceEl);

        //Make group
        circles = cfb.makeGroup();

        //Render circles
        if(includeOuter) {
          outerCircle = cfb.makeCircle(0, 0, (this.dimensions.radius * 0.7));
          outerCircle.fill = '#000000';
          outerCircle.linewidth = 0;
          outerCircle.opacity = 0.35;
          circles.add(outerCircle);
        }

        // innerCircle = cfb.makeCircle(0, 0, (this.dimensions.radius * 0.25));
        // innerCircle.fill = '#fff';
        // innerCircle.linewidth = 0;
        // circles.add(innerCircle);

        circles.translation.set(cfb.width/2, cfb.height/2);
        cfb.update();
      },

      renderClockFaceGuides: function(){
        var clockfaceEl = this.$('.guides')[0],
            guideTotal = 12,
            guides, cfg;

        cfg = this.cfGuides = new Two({width:this.dimensions.fullWidth, height:this.dimensions.fullHeight}).appendTo(clockfaceEl);

        //Render guides
        guides = cfg.makeGroup();

        for(var i = 0; i < 12; i++) {
          var points = App.Util.makePoint(30, i*5, (this.dimensions.radius/13), (this.dimensions.radius * 0.91));
          guides.add(cfg.makeLine(points.sx, points.sy, points.ex, points.ey));
        }
        guides.stroke = '#ffffff';
        guides.linewidth = 1;
        guides.opacity = 0.4;
        guides.translation.set(cfg.width/2, cfg.height/2);

        cfg.update();
      },

      renderClockHands: function(){
        var self = this,
            clockfaceEl = this.$('.hands')[0],
            ch, hands, sHand, sHandBase, mHand, hHand, updateClock, update, cap;

        ch = this.clockhands = new Two({width:this.dimensions.fullWidth, height:this.dimensions.fullHeight}).appendTo(clockfaceEl);

        updateClock = function(){
          var s = parseInt(moment().second(), 10),
              m = parseInt(moment().minute(), 10),
              h = parseInt(moment().hour(), 10),
              sPoints = App.Util.makePoint(30, s, 0, (self.dimensions.radius/1.15)),
              sBasePoints = App.Util.makePoint(30, s, -(self.dimensions.radius/5), 0),
              mPoints = App.Util.makePoint(30, m+(s/60), 0, (self.dimensions.radius/1.25)),
              hPoints = App.Util.makePoint(6, h+(m/60), 0, (self.dimensions.radius/2.25));

          ch.clear();

          hands = ch.makeGroup();
          hands.translation.set(ch.width/2, ch.height/2);

          sHand = ch.makeLine(sPoints.sx, sPoints.sy, sPoints.ex, sPoints.ey);
          sHand.linewidth = 2.5;
          sHandBase = ch.makeLine(sBasePoints.sx, sBasePoints.sy, sBasePoints.ex, sBasePoints.ey);
          sHandBase.linewidth = 7;

          mHand = ch.makeLine(mPoints.sx, mPoints.sy, mPoints.ex, mPoints.ey);
          mHand.linewidth = 5;
          hHand = ch.makeLine(hPoints.sx, hPoints.sy, hPoints.ex, hPoints.ey);
          hHand.linewidth = 7;

          hands.add(mHand);
          hands.add(hHand);
          hands.add(sHand);
          hands.add(sHandBase);

          sHand.stroke = '#ff8c1c';
          sHandBase.stroke = '#ff8c1c';
          mHand.stroke = '#ffffff';
          hHand.stroke = '#ffffff';

          cap = ch.makeCircle(0, 0, (self.dimensions.radius/13));
          cap.fill = '#ffffff';
          cap.stroke = '#ff8c1c';
          cap.linewidth = 4;
          cap.translation.set(ch.width/2, ch.height/2);

          ch.update();
        };

        update = setInterval(function(){
          updateClock();
        }, 1000);

        updateClock();
      },

      renderNumbers: function(){
        var self = this,
            el = this.$('.numbers'),
            coords, temp;

        for (var i = -1; ++i < 12;) {
          coords = App.Util.makePoint(30, (i+1)*5, 0, this.dimensions.radius);
          temp = $('<p />')
            .addClass('number')
            .html(i+1)
            .css({
              'left': coords.ex + 'px',
              'top': coords.ey + 'px'
            });

          el.append(temp);
        }
      },

      adjustMargins: function(){
        _.each(this.$('.temp, .number'), function(el){
          var $el = $(el);
          $el.css('margin-left', '-' + ($el.width()/2) + 'px');
        });
      }

    });
  };

}, Backbone.Advice, Two);