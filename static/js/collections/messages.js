var app = app || {};

(function(window) {
  'use strict';

  var Messages = Backbone.Collection.extend({
    model: app.Message,
    url: 'messages',
    socket: window.socket,
    initialize: function() {
      _.bindAll(this, 'serverCreate');
      this.ioBind('create', this.serverCreate, this);
    },
    serverCreate: function(data) {
      // Prevent duplicate models from being added
      var exists = this.get(data.id);
      if (!exists) {
        this.add(data);
      } else {
        data.fromServer = true;
        exists.set(data);
      }
    },
    messagesPerUser: function() {
      var stats = {},
          statsArray = [];
      this.each(function(message) {
        var sender = message.get('sender')
        if (Object.prototype.hasOwnProperty.call(stats, sender)) {
          stats[sender]++;
        } else {
          stats[sender] = 1;
        }
      });
      return stats;
    }
  });

  app.messages = new Messages();
})(window);