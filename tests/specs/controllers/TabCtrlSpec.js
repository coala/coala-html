"use strict";

describe('TabCtrl', function() {
    var scope = {}, rootScope = {}, location;
    scope.TAB = '/file/';

    describe('setTab()', function() {

        beforeEach(module('coalaHtmlApp'));
        beforeEach(inject(function ($controller, $location) {
            location = $location;
            $controller('TabCtrl', {
                $scope: scope,
                $rootScope: rootScope
            });
        }));

        it('test tab is set correctly', function() {
            scope.setTab(scope.TAB);
            expect(scope.tab).to.equal(scope.TAB);
        });

        it('test isSet()', function() {
            location.path(scope.TAB);
            expect(scope.isSet(scope.TAB)).to.equal(true);
        });

        it('test check if tab is set', function() {
            location.path(scope.TAB);
            scope.tab = location.path();
            expect(scope.tab).to.equal(scope.TAB);
        });
    });
});
