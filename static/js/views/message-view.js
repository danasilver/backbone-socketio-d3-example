var app = app || {};

(function() {
  'use strict';

  app.MessageView = Backbone.View.extend({
    tagName: 'li',
    initialize: function() {
      this.listenTo(app.app, 'username change', this.render);
    },
    render: function() {
      this.$el.html(this.model.get('message'));
      this.$el.toggleClass('sentByCurrentUser', this.sentByCurrentUser());
      return this;
    },
    sentByCurrentUser: function() {
      return this.model.get('sender') === app.app.username;
    }
  });
})();