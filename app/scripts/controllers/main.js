angular.module('memtoolsProtoApp')
.controller('MainCtrl', function ($scope, $window) {

  $scope.leftHandleX = 400;
  $scope.rightHandleX = 500;

  $scope.times = {
    start: -7,
    end: 0,
    delta: function(){ return this.start - this.end; }
  }

  var flameX1, flameX2, isSelecting;

  $scope.handleHighlightStyle = function(){
    var left = ($scope.leftHandleX < $scope.rightHandleX) ? $scope.leftHandleX : $scope.rightHandleX;
    $scope.highlightWidth = ($scope.leftHandleX < $scope.rightHandleX) ? $scope.rightHandleX - $scope.leftHandleX : $scope.leftHandleX - $scope.rightHandleX;

    return {
      'MozTransform' : 'translate3d(' + (left + 2) + 'px, 0, 0)',
      'webkitTransform' : 'translate3d(' + (left + 2) + 'px, 0, 0)',
      'width' : $scope.highlightWidth + 'px'
    }
  }

  var flameColors = ["#E65848", "#FDC536", "#afbc53", "#4CB0E1"];
  var groupColors = ["#9dde64", "#9dde64", "#45515e", "#45515e"];
  var numFlames = 200;
  var numStacks = 4;
  var flameLabels = ["String", "Array", "Object", "Misc."];

  $scope.flameData = stream_layers(numStacks, numFlames ,0.2).map(function(data, i) {
        return {
          key: 'Stream' + i,
          color: flameColors[i],
          groupColor: groupColors[i],
          label: flameLabels[i],
          values: data
        };
      });

  $scope.updateSelectedData = _.throttle(function(){

    var left = ($scope.leftHandleX < $scope.rightHandleX) ? $scope.leftHandleX : $scope.rightHandleX;
    var width = ($scope.leftHandleX < $scope.rightHandleX) ? $scope.rightHandleX - $scope.leftHandleX : $scope.leftHandleX - $scope.rightHandleX;

    var x1 =  left / $window.innerWidth;
    var x2 = (left + width) / $window.innerWidth;

    if(x1 == flameX1 && x2 == flameX2) return;

    flameX1 = x1;
    flameX2 = x2;

    $scope.leftTime =  ((1 - x1) * $scope.times.delta()).toFixed(2);
    $scope.rightTime = ((1 - x2) * $scope.times.delta()).toFixed(2);
    $scope.middleTime = (((1 - x1) + (1 - x2))/2 * $scope.times.delta()).toFixed(2);

    var newData = $scope.flameData.map(function(data, i){
      return {
        key: 'Stream' + i,
        color: flameColors[i],
        label: flameLabels[i],
        values: data.values.slice(parseInt(flameX1 * numFlames, 10), parseInt(flameX2 * numFlames, 10))
      }
    });

    $scope.startSize = _.reduce(newData, function(memo, d){
      return memo + d.values[0].y;
    }, 0).toFixed(2);

    $scope.endSize = _.reduce(newData, function(memo, d){
      return memo + d.values[d.values.length - 1].y;
    }, 0).toFixed(2);

    $scope.startCount = parseInt($scope.startSize * 323, 10);
    $scope.endCount = parseInt($scope.endSize * 323, 10);

    $scope.memDiff = ($scope.endSize- $scope.startSize).toFixed(2);
    $scope.selectedData = newData;
    $scope.updateDetails();
  }, 200);

  $scope.updateDetails = function(){
    var _selectionDetails = {};
    _.each($scope.selectedData, function(d){
      _.each(d.values, function(e){
        _selectionDetails[e.series] = _selectionDetails[e.series] || 0;
        _selectionDetails[e.series] += e.size;
      })
    });

    _selectionDetails = _.map(_selectionDetails, function(v, k){
      return parseInt(v * 323, 10);
    });

    $scope.selectionDetails = _selectionDetails;
    $scope.selectionSizeMax = _.max(_selectionDetails);
  }

  $scope.progressOneBar = function() {
    $scope.flameData.forEach(function(s, i){
      var tmp = s.values.shift();
      s.values.push(tmp);
    });
    $scope.lastChanged = new Date();
    $scope.$apply();
  };


  $scope.updateSelectedData();
  // var timer = setInterval($scope.progressOneBar, 1000);

  $('.handle.right').draggable({
    axis: 'x',
    drag: function(e, ui) {
      $scope.$apply(function(){
        $scope.rightHandleX = ui.offset.left;
        $scope.updateSelectedData();
      });
    }
  });

  $('.handle.left').draggable({
    axis: 'x',
    drag: function(e, ui) {
      $scope.$apply(function(){
        $scope.leftHandleX = ui.offset.left;
        $scope.updateSelectedData();
      });
    }
  });

});
