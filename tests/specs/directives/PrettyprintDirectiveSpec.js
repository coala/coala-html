"use strict";

describe('Prettyprint Directive', function() {

  var element, scope, $httpBackend;
  var codeHTML = '<pre ng-bind-html="undefined_variable"' +
                 '     class="prettyprint"></pre>';
  beforeEach(module('coalaHtmlApp'));
  beforeEach(inject(function ($compile, $rootScope) {
    scope = $rootScope.$new();
    element = $compile(codeHTML)(scope);
  }));
  beforeEach(inject(function ($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET('data/Constants.json').respond(200, {
      "data":"data",
      "roothome":"data/roothome",
      "file_data":"/file_data.json",
      "files":"/files.json",
      "coala":"/coala.json"
    });
    $httpBackend.whenGET('data/roothome').respond(200, {});
    $httpBackend.whenGET('data/file_data.json').respond(200, {});
    $httpBackend.whenGET('data/files.json').respond(200, {});
    $httpBackend.whenGET('data/coala.json').respond(200, {});
  }));
  afterEach(function() {
    $httpBackend.flush();
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  it('runs pretty print', function () {
    expect(element.find('span').length).to.equal(0);
    scope.$digest();
    expect(element.find('span').length).to.be.above(0);
    expect(element[0].querySelector('.L0')).to.be.a('null');
  });

  it('runs pretty print without linenums', function () {
    expect(element[0].querySelector('.L0')).to.be.a('null');
    scope.$digest();
    expect(element[0].querySelector('.L0')).to.be.a('null');
  });

  it('runs pretty print with linenums', function () {
    element.addClass("linenums");

    expect(element[0].querySelector('.L0')).to.be.a('null');
    scope.$digest();
    expect(element[0].querySelector('.L0')).to.not.be.a('null');
  });

  it('runs pretty print with linenums:XX', function () {
    element.addClass("linenums:5");

    expect(element[0].querySelector('.L4')).to.be.a('null');
    scope.$digest();
    expect(element[0].querySelector('.L4')).to.not.be.a('null');
  });

});
