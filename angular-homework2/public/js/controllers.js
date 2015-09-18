/**
 * Created by ArtemSedelnik on 02.09.15.
 */
'use strict';

var Controllers = angular.module('Controllers', ['ngRoute', 'ngResource', 'Directives']);

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
    $scope.showModal = false;
    $scope.typeOfNumber = 'home';
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
    $scope.showPopup = function(person){
        var fullName = person.firstName + ' ' + person.lastName;
        var phoneHome = $filter('filter')(person.phoneNumber, { type: 'home' })[0];
        var phoneFax = $filter('filter')(person.phoneNumber, { type: 'fax' })[0];
        $scope.person = person;
        $scope.person.fullName = fullName;
        $scope.person.phoneHome = phoneHome.number;
        $scope.person.phoneFax = phoneFax.number;
        $scope.showModal = true;

        $scope.submit = function () {
            $scope.lastViewedPerson = fullName;
            $scope.showModal = false;
        };

        $scope.cancel = function () {
            $scope.showModal = false;
        };
    }
}]);



