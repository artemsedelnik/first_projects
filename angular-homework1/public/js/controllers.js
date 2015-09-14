/**
 * Created by ArtemSedelnik on 02.09.15.
 */
'use strict';

/* Controllers */
var Controllers = angular.module('Controllers', ['ngRoute', 'ngResource']);

Controllers.config(['$routeProvider', '$locationProvider', function($routeProvide, $locationProvider){
    $routeProvide
        .when('/',{
            templateUrl:'templates/home.html',
            controller:'PhoneListCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);


Controllers.controller('UsersCtrl',['$scope','$http', '$location', '$filter',  function($scope, $http, $location, $filter) {
    $scope.isContentShowed = false;
    $scope.typeOfNumber = 'fax';
    $scope.sortType = 'firstName';
    $scope.sortReverse = false;
    $scope.toggleContent = function (event){
        if ($scope.isContentShowed){
            event.target.className = "btn btn-default";
            event.target.innerHTML = "Show lesson content";
            $scope.isContentShowed = false;
        } else {
            if (!$scope.persons) {
                $scope.getPersons();
            }
            event.target.className = "btn btn-primary";
            event.target.innerHTML = "Hide lesson content";
            $scope.isContentShowed = true;
        }
    };
    $scope.getPersons = function() {
        $http.get('data').success(function(data){
            $scope.persons = data;
        })
    };
    $scope.changePhone = function(phones) {
        var phone = $filter('filter')(phones, {type: $scope.typeOfNumber})[0];
        return phone.number;
    };
}]);



