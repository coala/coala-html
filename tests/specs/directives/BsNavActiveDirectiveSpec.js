"use strict";

describe('BsNavActive Directive', function() {

  var element, scope, location;
  var codeHTML = '<ul bs-nav-active class="nav navbar-nav">' +
                 '  <li class="item1"><a href="#/item1">item1</a></li>' +
                 '  <li class="item2"><a href="#/item2">item2</a></li>' +
                 '</ul>';
  beforeEach(module('coalaHtmlApp'));
  beforeEach(module(function ($locationProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  }));

  beforeEach(inject(function ($compile, $rootScope, $location) {
    scope = $rootScope.$new();
    location = $location;
    element = $compile(codeHTML)(scope);
  }));

  it('activates item', function () {
    location.path('item1');
    scope.$digest();
    expect(location.path()).to.be.equal('/item1');
    expect(angular.element(element[0].querySelector('.item1'))
             .hasClass('active')).is.ok;
  });

  it('deactivates item after active changes', function () {
    angular.element(element[0].querySelector('.item1')).addClass('active');
    scope.$digest();
    expect(location.path()).to.not.be.equal('/item1');
    expect(angular.element(element[0].querySelector('.item1'))
             .hasClass('active')).is.not.ok;
  });
});
