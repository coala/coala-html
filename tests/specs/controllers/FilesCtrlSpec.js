"use strict";

describe('FilesCtrl', function() {
    var scope = {}, routeParams = {}, rootScope = {};
    var FILE_CONTENTS = {
        "name": "/home/Desktop/test.py",
        "type": "file",
        "result" : true
    };
    var LINK_NAME_CONTAINER = [{name: '/', link: '#/file//home'},
                               {name: 'Desktop', link: '#/file//home/Desktop'}];
    routeParams.fileName = "/home/Desktop";
    rootScope.ROOTHOME = "/home";
    rootScope.FILES = {"/home/Desktop" : ["/home/Desktop/test.py"]};
    rootScope.resultFiles = {"/home/Desktop/test.py" : [{"start": 2,
                                      "end": 5,
                                      "diffs": '+diffs',
                                      "message": 'test',
                                      "origin": 'PEP8',
                                      "severity": 'NORMAL'
                                    }]};
    rootScope.FILE_DATA = {"/home/Desktop/test.py" : ["import this\n"]};

    describe('parseCoalaProject()', function() {

        beforeEach(module('coalaHtmlApp'));
        beforeEach(inject(function ($controller) {
            $controller('FilesCtrl', {
                $scope: scope,
                $routeParams: routeParams,
                $rootScope: rootScope
            });
        }));

        it('test fileName is set correctly', function() {
            expect(scope.fileName).to.equal(routeParams.fileName);
        });
        it('test fileBack is obtained correctly', function() {
            expect(scope.fileBack).to.equal('/home');
        });
        it('test fileType', function() {
            expect(scope.fileType).to.equal('dir');
        });
        it('test fileContents', function() {
            expect(scope.fileContents).to.deep.equal([FILE_CONTENTS]);
        });

    });

    describe('basename()', function() {
        beforeEach(module('coalaHtmlApp'));
        beforeEach(inject(function ($controller) {
            $controller('FilesCtrl', {
                $scope: scope,
                $routeParams: routeParams,
                $rootScope: rootScope
            });
        }));
        it('test parseCoalaProject', function() {
            expect(scope.basename('/home/Desktop/test.py')).to.equal('test.py');
        });
    });

    describe('getNameLink()', function() {
        beforeEach(module('coalaHtmlApp'));
        beforeEach(inject(function ($controller) {
            $controller('FilesCtrl', {
                $scope: scope,
                $routeParams: routeParams,
                $rootScope: rootScope
            });
        }));
        it('test fileName link', function() {
            expect(scope.linkNameContainer).to.deep.equal(LINK_NAME_CONTAINER);
        });
    });

    describe('test file', function() {
        beforeEach(module('coalaHtmlApp'));
        beforeEach(inject(function ($controller, _$rootScope_) {
            routeParams.fileName = "/home/Desktop/test.py";
            scope = _$rootScope_.$new();
            $controller('FilesCtrl', {
                $scope: scope,
                $routeParams: routeParams,
                $rootScope: rootScope
            });
        }));
        it('test fileType', function() {
            expect(scope.fileType).to.equal('file');
        });
        it('test fileContents', function() {
            expect(scope.fileContents).to.equal("import this\n");
        });

    });
});
