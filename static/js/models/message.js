var app = app || {};

(function() {
  'use strict';

  app.Message = Backbone.Model.extend({
    urlRoot: 'message',
    noIoBind: false,
    socket: window.socket,
    initialize: function() {
      _.bindAll(this, 'serverChange');

      // Only want to bind to new models from the server since the server
      // assigns the id.
      if (!this.noIoBind) {
        this.ioBind('update', this.serverChange, this);
      }
    },
    serverChange: function(data) {
      data.fromServer = true;
      this.set(data);
    },
    defaults: {
      message: '',
      sender: ''
    }
  });
})();