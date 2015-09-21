/**
 * Created by ArtemSedelnik on 02.09.15.
 */
'use strict';

var Controllers = angular.module('Controllers', ['ngRoute', 'ngResource', 'Directives']);

Controllers.config(['$routeProvider', function($routeProvide){
    $routeProvide
        .when('/list',{
            templateUrl:'templates/home.html'
        })
        .when('/person/:personId', {
            templateUrl:'templates/editPerson.html',
            controller:'EditPersonCtrl'
        })
        .otherwise({
            redirectTo: '/list'
        });
}]);


Controllers.controller('UsersCtrl',['$scope','$http', '$filter',  function($scope, $http, $filter) {
    $scope.isContentShowed = false;
    $scope.showModal = false;
    $scope.typeOfNumber = 'home';
    $scope.sortType = 'lastName';
    $scope.sortReverse = false;
    $scope.getPersons = function() {
        $http.get('data').success(function(data){
            $scope.persons = data;
        })
    };
    if (!$scope.persons) {
        $scope.getPersons();
    }
    $scope.toggleContent = function (event){
        if ($scope.isContentShowed){
            event.target.className = "btn btn-default";
            event.target.innerHTML = "Show lesson content";
            $scope.isContentShowed = false;
        } else {
            event.target.className = "btn btn-primary";
            event.target.innerHTML = "Hide lesson content";
            $scope.isContentShowed = true;
        }
    };
    $scope.changePhone = function(phones, typeOfNumber) {
        var phone = $filter('filter')(phones, {type: typeOfNumber})[0];
        return phone.number;
    };
    $scope.showPopup = function(person){
        var fullName = person.firstName + ' ' + person.lastName;
        var phoneHome = $filter('filter')(person.phoneNumber, { type: 'home' })[0];
        var phoneFax = $filter('filter')(person.phoneNumber, { type: 'fax' })[0];
        $scope.person = person;
        $scope.firstName = person.firstName;
        $scope.lastName =  person.lastName;
        $scope.age = person.age;
        $scope.city = person.address.city;
        $scope.fullName = fullName;
        $scope.phoneHome = phoneHome.number;
        $scope.phoneFax = phoneFax.number;
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

Controllers.controller('EditPersonCtrl',['$scope','$http', '$routeParams', '$filter', '$location', function($scope, $http, $routeParams, $filter, $location) {
    $scope.personId = $routeParams.personId;
    $scope.person = $filter('filter')($scope.persons, {id: $scope.personId})[0];
    $scope.editingPerson = angular.copy($scope.person);
    var phoneHome = $filter('filter')($scope.person.phoneNumber, { type: 'home' })[0];
    var phoneFax = $filter('filter')($scope.person.phoneNumber, { type: 'fax' })[0];
    var personIndex = $scope.persons.indexOf($scope.person);
    var phones = [];
    $scope.fullName = $scope.person.firstName + ' ' + $scope.person.lastName;
    $scope.phoneHome = phoneHome.number;
    $scope.phoneFax = phoneFax.number;

    $scope.cancel = function(){
        $location.path('/list');
    };

    $scope.isPersonChanged = function(){
        phones = [];
        phones.push({type: 'home', number: $scope.phoneHome}, {type: 'fax', number: $scope.phoneFax});
        $scope.editingPerson.phoneNumber = phones;
        return angular.toJson($scope.editingPerson) != angular.toJson($scope.person);
    };

    $scope.updatePerson = function(event){
        phones = [];
        phones.push({type: 'home', number: $scope.phoneHome}, {type: 'fax', number: $scope.phoneFax});
        $scope.editingPerson.phoneNumber = phones;
        $scope.person = $scope.editingPerson;
        $scope.persons[personIndex] = $scope.person;

        $http.post('/updatePerson', $scope.person)
            .success(function() {
                $location.path("/list");
            })
            .error(function(data){
                alert('server error');
            });
    }


}]);



