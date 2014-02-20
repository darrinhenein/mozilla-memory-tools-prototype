angular.module('memtoolsProtoApp').directive('timeline', function(){

 var margin = {left: 10, right: 10, top: 7, bottom: 0},
 width = 2000,
 height = 20;

 return {
  restrict: 'A',
  scope: {
    left: '=',
    right: '='
  },
  link: function(scope, element, controller) {

    var vis = d3.select(element[0])
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("preserveAspectRatio","xMinYMin")
    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
    .append("g")
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var x = d3.scale.linear().domain([scope.left, scope.right]).range([margin.left, width - margin.right]);
    var xAxis = d3.svg.axis().scale(x).orient('top')
      .ticks(90)
      .tickFormat(function(t){if(t % 0.5 === 0) return d3.format(',.1f')(t) + 's'})
      .tickSize(24);


    vis.selectAll('*').remove();
    vis.selectAll("svg")
    .append("g");

    vis.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'translate(15, 10)');
  }
}
});