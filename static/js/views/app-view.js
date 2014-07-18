var app = app || {};

(function() {
  'use strict';

  app.AppView = Backbone.View.extend({
    el: '#chatapp',
    events: {
      'keyup #username': 'setUsername',
      'keydown #message': 'sendOnEnter'
    },
    initialize: function() {
      this.username = '';

      this.$chatlog = this.$('#chatlog');
      this.$username = this.$('#username');
      this.$message = this.$('#message');

      this.listenTo(app.messages, 'add', this.addOne);
      this.listenTo(app.messages, 'reset', this.addAll);
      this.listenTo(app.messages, 'all', this.render);

      app.messages.fetch({ reset: true });
    },
    render: function() {
      this.$chatlog.animate({scrollTop: this.$chatlog[0].scrollHeight}, 1000);
      return this;
    },
    addOne: function(message) {
      var view = new app.MessageView({ model: message });
      this.$chatlog.append(view.render().el);
    },
    addAll: function() {
      this.$chatlog.html('');
      app.messages.each(this.addOne, this);
    },
    newAttributes: function() {
      return {
        message: this.$message.val().trim(),
        sender: this.username
      }
    },
    setUsername: function(e) {
      this.username = this.$username.val();
      this.trigger('username change', this.username);
    },
    sendOnEnter: function(e) {
      if (e.which === app.ENTER_KEY) {
        app.messages.create(this.newAttributes());
        this.$message.val('');
      }
    }
  });
})();