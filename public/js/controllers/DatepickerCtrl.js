'use strict';
var app = angular.module('muriquee')

app.controller('DatepickerCtrl', function ($scope, $localStorage) {
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.$watch('dt', function(newValue, oldValue){
        $localStorage.selectedDate = newValue;
    })

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    //$scope.toggleMin();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.getDayClass = function(date, mode) {
        var classes = []
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);

            for (var i=0;i<$localStorage.profile.negotiations.length;i++){
                var n = $localStorage.profile.negotiations[i];
                var ndt = new Date(n.date).setHours(0,0,0,0);
                if (dayToCheck === ndt){
                    classes.push('event-negotiation');
                    break;
                }
            }
            for (var i=0;i<$localStorage.profile.proposals.length;i++){
                var p = $localStorage.profile.proposals[i];
                var pdt = new Date(p.date).setHours(0,0,0,0);
                if (dayToCheck === ndt){
                    classes.push('event-proposal');
                    break;
                }
            }
        }

        return classes;
    };
});

