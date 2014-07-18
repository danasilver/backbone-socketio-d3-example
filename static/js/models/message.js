var app = app || {};

(function() {
  'use strict';

  app.Message = Backbone.Model.extend({
    urlRoot: 'message',
    defaults: {
      message: '',
      sender: ''
    }
  });
})();