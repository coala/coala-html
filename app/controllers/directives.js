'use strict';

angular.module('coalaHtmlApp')
  .directive('prettyprint',["$routeParams", "$rootScope",
    function($routeParams, $rootScope) {
    return {
      priority: 10,  // Decrease priority so it's run after ngBindHtml
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
        // When ngBindHtml changes value, we parse the html again
        scope.$watch(attrs.ngBindHtml, function(newValue) {
          // Look for a class like linenums or linenums:<n> where <n> is the
          // 1-indexed number of the first line.
          var elementClasses = element[0].className;
          var lineNumClass = elementClasses.match(/\blinenums\b(?::(\d+))?/);
          var lineNums = Boolean(lineNumClass);
          if (lineNumClass && lineNumClass[1] && lineNumClass[1].length > 0) {
            lineNums = +lineNumClass[1];  // Convert to integer
          }
          element.html(prettyPrintOne(newValue, '', lineNums));

          // Idea is to create elements dynamically and append to the code block.
          var highlightLineClass = "highlight-line";
          var ol = element[0].getElementsByTagName('ol')[0];
          var lines = ol.children, linesCount = lines.length;
          $rootScope.resultFiles[$routeParams.fileName].forEach(function(result) {
            for(var index=result.start-1; index<result.end; index++) {
              lines[index].classList.add(highlightLineClass);
            }
            var diffPre = document.createElement('pre');
            var msgSpan = document.createElement('span');
            diffPre.classList.add('diff-highlight');
            msgSpan.classList.add('msg-highlight');
            diffPre.innerHTML = result.diffs[$routeParams.fileName];
            msgSpan.innerHTML = result.message;
            if(result.end-linesCount===0) {
              lines[result.end-1].appendChild(msgSpan);
              lines[result.end-1].appendChild(diffPre);
            } else {
              ol.insertBefore(diffPre, lines[result.end]);
              ol.insertBefore(msgSpan, lines[result.end]);
            }
          });
        });
      }
    };
  }])
  .directive('bsNavActive', function($location) {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        // Watch for the $location
        scope.$watch(function() {
          return $location.path();
        }, function(newValue) {
          var liElements = element[0].getElementsByTagName('li');

          angular.forEach(liElements, function(li) {
            var liElement = angular.element(li);
            var aElement = angular.element(li.getElementsByTagName('a'));
            var href = aElement.attr('href');

            if ('#' + newValue === href) {
              liElement.addClass('active');
            } else {
              liElement.removeClass('active');
            }
          });
        });
      }
    };
  })
  .directive('tableRowLinks', function() {
    return {
      priority: 10,
      restrict: 'A',
      link: function postLink(scope, element) {
        scope.$watch(function () {
          return element[0].childNodes.length;
        }, function() {
          var trElements = element[0].getElementsByTagName('tr');

          angular.forEach(trElements, function(tr) {
            var trElement = angular.element(tr);
            var aElement = angular.element(tr.getElementsByTagName('a'));

            if (aElement.length !== 0) {
              trElement.addClass("table-row-link");
              trElement.on("click", function() {
                aElement[0].click();
              });
            }
          });
        });
      }
    };
  });
