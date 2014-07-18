var app = app || {};

(function() {
  app.BarChartView = Backbone.View.extend({
    el: "#barChart",
    initialize: function() {
      // Properties for our chart
      this.margin = {top: 20, right: 20, bottom: 30, left: 40};
      this.height = 300 - this.margin.top - this.margin.bottom;
      this.width = 500 - this.margin.left - this.margin.right;

      // Setup elements for the view
      this.d3el = d3.select(this.el);
      this.d3el.append('svg');
      this.xAxisEl = this.d3el.append('g').attr('class', 'x axis');
      this.yAxisEl = this.d3el.append('g').attr('class', 'y axis');
      this.rectsEl = this.d3el.append('g').attr('class', 'rects')
          .attr('transform', 'translate(' + this.margin.left + ','
                + this.margin.top + ')');
      this.yAxis.append('text')
          .style('text-anchor', 'end')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '.71em')
          .text('Frequency');

      // Create D3 constructors ahead of time
      this.x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1);
      this.y = d3.scale.linear().range([this.height, 0]);
      this.xAxis = d3.svg.axis().orient('bottom');
      this.yAxis = d3.svg.axis().orient('left').ticks(5);

      // Listen for changes on the messages collection
      this.listenTo(app.messages, 'add', this.render);
    },
    render: function() {
      // Everything in render is affected by the data
      var data = messagesPerUser();

      this.x.domain(data.map(function(d) { return d.key; }));
      this.y.domain([0, d3.max(data, function(d) { return d.value; })]);

      this.xAxis.scale(this.x);
      this.yAxis.scale(this.y);

      this.xAxisEl.call(xAxis);
      this.yAxisEl.call(yAxis);

      var rects = this.rectsEl.selectAll('rect')
          .data(data);

      rects.exit().remove();

      rects.enter().append('rect');

      rects
          .attr('class', 'bar')
          .attr('x', function(d) { return x(d.key); })
          .attr('y', function(d) { return y(d.value); })
          .attr('width', x.rangeBand())
          .attr('height', function(d) { return this.height - y(d.value); });
    },
    messagesPerUser: function() {
      var stats = {},
          nativeHasOwnProperty = Object.prototype.hasOwnProperty;
      app.messages.each(function(message) {
        var sender = message.get('sender');
        if (nativeHasOwnProperty.call(stats, sender)) stats[sender]++;
        else stats[sender] = 1;
      });
      return d3.entries(stats);
    }
  });
})();