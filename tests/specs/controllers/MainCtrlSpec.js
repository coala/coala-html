"use strict";

describe('MainCtrl', function() {
    var scope = {}, rootScope = {}, $httpBackend;
    var CONSTANTS = {
        "data":"data",
        "roothome":"data/roothome",
        "file_data":"/file_data.json",
        "files":"/files.json",
        "coala":"/coala.json"
    };
    var RESULT_FILES = {"/home/Desktop/test.py": [{
                          "start":    33,
                          "end":      40,
                          "diffs":    {"/home/Desktop/test.py": "DIFF\n"},
                          "message":  "The code does not comply to PEP8.",
                          "origin":   "PEP8Bear",
                          "severity": 1
                        }]};
    var ROOTHOME = "/home";
    var FILES = {"/home/Desktop" : ["/home/Desktop/test.py"]};
    var FILE_DATA = {"/home/Desktop/test.py" : ["import this\n"]};
    var COALA_JSON = {
          "logs": [],
          "results": {
            "autopep8": [
              {
                "additional_info": "",
                "affected_code": [
                  {
                    "end": {
                      "column": null,
                      "file": "/home/Desktop/test.py",
                      "line": 40
                    },
                    "file": "/home/Desktop/test.py",
                    "start": {
                      "column": null,
                      "file": "/home/Desktop/test.py",
                      "line": 33
                    }
                  }
                ],
                "debug_msg": "",
                "diffs": {
                  "/home/Desktop/test.py": "DIFF\n"
                },
                "id": 110780194316329970598265416648045230634,
                "message": "The code does not comply to PEP8.",
                "origin": "PEP8Bear",
                "severity": 1
              }
            ]
          }
        };

    describe('parseCoalaProject()', function() {

        beforeEach(module('coalaHtmlApp'));
        beforeEach(inject(function ($controller, $injector,  _$rootScope_) {
            $httpBackend = $injector.get('$httpBackend');
            rootScope = _$rootScope_;
            scope = _$rootScope_.$new();
            $httpBackend.whenGET('data/Constants.json')
                .respond(200, CONSTANTS);
            $httpBackend.whenGET(CONSTANTS.data + CONSTANTS.coala)
                .respond(200, COALA_JSON);
            $httpBackend.whenGET(CONSTANTS.data + CONSTANTS.file_data)
                .respond(200, FILE_DATA);
            $httpBackend.whenGET(CONSTANTS.data + CONSTANTS.files)
                .respond(200, FILES);
            $httpBackend.whenGET(CONSTANTS.roothome)
                .respond(200, ROOTHOME);
            $httpBackend.flush();
            $controller('MainCtrl', {
                $scope: scope,
                $rootScope: rootScope
            });
            $httpBackend.flush();
        }));
        afterEach(function() {
          $httpBackend.verifyNoOutstandingExpectation();
          $httpBackend.verifyNoOutstandingRequest();
        });

        it('test result count', function() {
            expect(rootScope.resultsCount).to.equal(1);
        });
        it('test parseResult', function() {
            expect(rootScope.resultFiles).to.deep.equal(RESULT_FILES);
        });
        it('test scope.data', function() {
            expect(scope.data).to.deep.equal([rootScope.resultFiles]);
        });

    });
});
