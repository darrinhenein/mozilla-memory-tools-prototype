angular.module('memtoolsProtoApp').directive('flamechart', function(){

 return {
  restrict: 'A',
  scope: {
    data: '=',
    top: '=',
    changed: '=',
    grouped: '='
  },
  link: function(scope, element, controller) {

    var margin = {left: 0, right: 0, top: scope.top, bottom: 0};
    var node = $("svg", element[0])[0];

    var chart;

    var vis = d3.select(node)
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("preserveAspectRatio","xMinYMin")
    .attr("viewBox","0 0 100% 100%");
    ;

    scope.$watchCollection('[data, changed]', function (newVal, oldVal) {
      if(newVal != oldVal) updateChart();
    });

    var updateChart = function() {

      if(scope.grouped) {
        _.each(scope.data, function(d){
          console.log(d);
          d.color = d.groupColor;
        })
      }

      vis.datum(scope.data).call(chart);
    }

    var drawGraph = function(){

      nv.addGraph(function() {
        chart = nv.models.multiBarChart()
              .margin(margin)
              .transitionDuration(0)
              .delay(0)
              .groupSpacing(0.1)
              .stacked(true)
              .tooltips(false)
              .showLegend(false)
              .showXAxis(false)
              .showYAxis(false)
              .showControls(false)
              ;

            vis.datum(scope.data).call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
       });
      }

      drawGraph();

    }
  }
});