"use strict";

describe('Prettyprint Directive', function() {

  var element, scope, $httpBackend;
  var codeHTML = '<pre ng-bind-html="fileContents"' +
                 '     class="prettyprint linenums"></pre>';
  beforeEach(module('coalaHtmlApp'));
  beforeEach(inject(function ($compile, $rootScope, $routeParams) {
    scope = $rootScope.$new();
    $rootScope.resultFiles = {"/home/Desktop/test.py" : [
                              {"start": 1,
                                "end": 1,
                                "diffs": {"/home/Desktop/test.py": "diff"},
                                "message": 'test',
                                "origin": 'PEP8',
                                "severity": 'NORMAL'
                              },
                              {"start": 2,
                               "end": 2,
                               "diffs": {"/home/Desktop/test.py": "diff"},
                               "message": 'test',
                               "origin": 'PEP8',
                               "severity": 'NORMAL'}]};
    $routeParams.fileName = "/home/Desktop/test.py";
    scope.fileContents = "import this\nimport antigravity\n";
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
    var li0 = '<span class="kwd">import</span><span class="pln">'+
              ' </span><span class="kwd">this</span>';
    var li1 = '<span class="kwd">import</span>'+
              '<span class="pln"> antigravity</span>';
    var resultInfo = 'test<span class="msg-highlight">test</span>'+
                     '<pre class="diff-highlight">diff</pre>';

    expect(element[0].querySelector('.L0').innerHTML).to.equal(li0);
    expect(element[0].querySelector('.L1').innerHTML).to.equal(li1);
    expect(element[0].querySelector('ol').children[1].innerHTML).to.equal(resultInfo);
  });
  it('runs pretty print with linenums:XX', function () {
    element.addClass("linenums:0");

    expect(element[0].querySelector('.L0')).to.be.a('null');
    scope.$digest();
    expect(element[0].querySelector('.L0')).to.not.be.a('null');
  });

});
