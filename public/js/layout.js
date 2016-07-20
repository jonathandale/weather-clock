
App.module('Layout', function (Layout, App, Backbone, Marionette, $, _){

  //Status
  Layout.Status = Backbone.Marionette.ItemView.extend({
    tagName: 'p',
    className: 'message',

    serializeData: function(){
      return {
        'message': this.options.message
      };
    },

    onRender: function(){
      if(this.options.className) this.$el.addClass(this.options.className);
    }
  });

  //Main forecast views
  Layout.Main = Backbone.Marionette.LayoutView.extend({

    template: '#template-main',

    tagName: 'ul',
    className: 'main-wrapper',

    onRender: function(){
      var self = this,
          verticalOffset = App.navigation.$el.height();

      this.dimensions = App.Util.getLayoutDimensions();

      this.$el.width(App.routes.length * this.dimensions.fullWidth);

      _.each(App.routes, function(regionName){
        var viewName = self[regionName+'View'];

        viewName = new App.Views[App.Util.Capitalize(regionName)+'View']({model: self.model});

        viewName.$el.css({
          'width': self.dimensions.fullWidth+'px',
          'height': (self.dimensions.fullHeight - verticalOffset)+'px'
        }).addClass('section');

        self[regionName+'Region'].show(viewName);
      });
    }
  });

  //Nav
  Layout.Navigation = Backbone.Marionette.ItemView.extend({
    template: '#template-nav',
    ui: {
      sections: 'a',
      scale: 'a.scale'
    },

    events: {
      'click @ui.scale': 'toggle',
    },

    onRender: function(){
      this.listenTo(App.vent, 'onRoute', this.updateNav);
    },

    updateNav: function(screen){
      this.ui.sections.parent().removeClass('selected');
      this.ui.sections.filter('[data-screen="'+screen+'"]').parent().addClass('selected');
    },

    toggle: function(e){
      var currentEl = $(e.currentTarget).find('.active').removeClass('active'),
          current = currentEl.attr('class'),
          future = (current === 'f') ? 'c' : 'f';

      $(e.currentTarget).find('.' + future).addClass('active');
      App.vent.trigger('scale-change', future);
    }

  });

});