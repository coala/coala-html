"use strict";

describe('LogsCtrl', function() {
    var scope = {}, rootScope = {};
    rootScope.COALA_JSON = {
        'logs' : 'LOGS'
    };

    describe('parseCoalaProject()', function() {

        beforeEach(module('coalaHtmlApp'));
        beforeEach(inject(function ($controller) {
            $controller('LogsCtrl', {
                $scope: scope,
                $rootScope: rootScope
            });
        }));

        it('test log data is fetched correctly', function() {
            expect(scope.data).to.equal(rootScope.COALA_JSON.logs);
        });

    });
});
