/**
 * Created by ArtemSedelnik on 02.09.15.
 */
'use strict';

var Controllers = angular.module('Controllers', ['ngRoute', 'ngResource', 'Directives', 'ui.grid']);

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

Controllers.controller('UsersCtrl',['$scope','$http', '$filter', 'uiGridConstants',  function($scope, $http, $filter, uiGridConstants) {
    $scope.isContentShowed = false;
    $scope.showAlert = false;
    $scope.isUpdatedSuccess = false;
    $scope.typeOfNumber = 'home';
    $scope.sortType = 'lastName';
    $scope.sortReverse = false;
    $scope.getPersons = function() {
        $http.get('data').success(function(data){
            $scope.persons = data;
            $scope.gridOptions.data = $scope.persons; //Grid data
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


    $scope.filterForGrid = {
        //term: '2',
        type: uiGridConstants.filter.SELECT,
        selectOptions: [ { value: 'home', label: 'Home Number' }, { value: 'fax', label: 'Fax Number' } ]
    };
    $scope.phoneTypes = [
        { name: 'home', label: 'Home Number'},
        {name: 'fax', label: 'Fax Number'}];

    $scope.selectPhoneType = $scope.phoneTypes[0];
    //GRID OPTIONS
    $scope.gridOptions = {
        enableSorting: true,
        enableFiltering: true,
        rowHeight: 46,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            //$scope.gridApi.grid.refresh();
        },
        columnDefs: [
            {field: 'firstName'},
            {field: 'lastName'},
            {field: 'age'},
            {field: 'address.city', name: 'city'},
            {
                field: 'phoneNumber',
                filterHeaderTemplate: '<div class="ui-grid-cell-contents"><select ng-model="grid.appScope.selectPhoneType" ng-options="type.label for type in grid.appScope.phoneTypes" class="form-control"></select></div>',
                cellFilter: 'selectPhone:grid.appScope.selectPhoneType.name'
            },
            {
                name: 'actions',
                enableFiltering: false,
                enableSorting: false,
                cellTemplate: '<div class="ui-grid-cell-contents">'
                + '<button ng-click="grid.appScope.editCtrl.showPopup(row.entity)" type="button" class="btn btn-default">'
                + ' <i class="ws-icon-gl-pencil black"></i>'
                + '</button>'
                + '<button class="btn btn-default" ng-click="grid.appScope.deleteCtrl.showDeletePopup(row.entity)" >'
                + '<i class="ws-icon-gl-trash black"></i>'
                + '</button>'
                + '</div>'
            }
        ]
    };
}]);

Controllers.filter('selectPhone', function() {
    return function(phones, type) {
        function filterByType(obj) {
            if (obj.type == type) {
                return obj;
            }
        }
        var arrByType = phones.filter(filterByType);
        return arrByType[0].number;
    }});

Controllers.controller('EditPersonCtrl',['$scope','$http', '$routeParams', '$filter', '$location', function($scope, $http, $routeParams, $filter, $location) {
    $scope.editCtrl = {};
    $scope.editCtrl.showModal = false;
    $scope.editCtrl.person = {};
    var phones = [];
    var personIndex;
    $scope.editCtrl.showPopup = function(person){

        $scope.editCtrl.person = person;
        $scope.editCtrl.fullName = $scope.editCtrl.person.firstName + ' ' + $scope.editCtrl.person.lastName;
        $scope.editCtrl.showModal = true;
        setPersonProperties();

        $scope.editCtrl.cancel = function () {
            $scope.editCtrl.showModal = false;
        };
    };
    if ($routeParams.personId){
        $scope.editCtrl.personId = $routeParams.personId;
        $scope.editCtrl.person = $filter('filter')($scope.persons, {id: $scope.editCtrl.personId})[0];
        $scope.editCtrl.fullName = $scope.editCtrl.person.firstName + ' ' + $scope.editCtrl.person.lastName;
        setPersonProperties();
    }

    function setPersonProperties (){
        $scope.editCtrl.editingPerson = angular.copy($scope.editCtrl.person);
        var phoneHome = $filter('filter')($scope.editCtrl.editingPerson.phoneNumber, { type: 'home' })[0];
        var phoneFax = $filter('filter')($scope.editCtrl.editingPerson.phoneNumber, { type: 'fax' })[0];
        personIndex = $scope.persons.indexOf($scope.editCtrl.person);
        $scope.editCtrl.phones = {};
        $scope.editCtrl.phones.phoneHome = phoneHome.number;
        $scope.editCtrl.phones.phoneFax = phoneFax.number;
    }

    $scope.cancel = function(){
        $location.path('/list');
    };

    $scope.editCtrl.isPersonChanged = function(){
        if(!$scope.editCtrl.editingPerson)
            return false;
        phones = [];
        phones.push({type: 'home', number: $scope.editCtrl.phones.phoneHome}, {type: 'fax', number: $scope.editCtrl.phones.phoneFax});
        $scope.editCtrl.editingPerson.phoneNumber = phones;
        return angular.toJson($scope.editCtrl.editingPerson) != angular.toJson($scope.editCtrl.person);
    };

    $scope.editCtrl.updatePerson = function(){
        $scope.editCtrl.lastViewedPerson = $scope.fullName;
        phones = [];
        phones.push({type: 'home', number: $scope.editCtrl.phones.phoneHome}, {type: 'fax', number: $scope.editCtrl.phones.phoneFax});
        $scope.editCtrl.editingPerson.phoneNumber = phones;
        $scope.editCtrl.person = $scope.editCtrl.editingPerson;
        $scope.persons[personIndex] = $scope.editCtrl.person;

        $http.post('/updatePerson', $scope.editCtrl.person)
            .success(function() {
                $location.path("/list");
                $scope.isUpdatedSuccess = true;
                $scope.showAlert = true;
            })
            .error(function(){
                $scope.isUpdatedSuccess = false;
                $scope.showAlert = true;
            });

        $scope.editCtrl.showModal = false;
    }
}]);

Controllers.controller('AddPersonCtrl',['$scope','$http', '$routeParams', '$filter', '$location', function($scope, $http){

    $scope.addCtrl = {};
    $scope.addCtrl.newPerson = {};
    $scope.addCtrl.newPerson.id = 0;
    $scope.addCtrl.showAddModal = false;

    $scope.addCtrl.showAddPopup = function(){
        $scope.addCtrl.showAddModal = true;
        $scope.addCtrl.phones = {};

        $scope.addCtrl.cancel = function () {
            $scope.addCtrl.showAddModal = false;
        };
    };

    $scope.addCtrl.addPerson = function(){
        $scope.addCtrl.newPerson.id = Math.floor((Math.random() * 10000) + 1);
        var phones = [];
        phones.push({type: 'home', number: $scope.addCtrl.phones.phoneHome}, {type: 'fax', number: $scope.addCtrl.phones.phoneFax});
        $scope.addCtrl.newPerson.phoneNumber = phones;

        $http.post('/addPerson', $scope.addCtrl.newPerson)
            .success(function() {
                $scope.persons.push($scope.addCtrl.newPerson);
                $scope.isUpdatedSuccess = true;
                $scope.showAlert = true;
            })
            .error(function(){
                $scope.isUpdatedSuccess = false;
                $scope.showAlert = true;
            });

        $scope.addCtrl.showAddModal = false;
    }
}]);


Controllers.controller('DeletePersonCtrl',['$scope','$http', '$routeParams', '$filter', '$location', function($scope, $http){

    $scope.deleteCtrl = {};

    $scope.deleteCtrl.deletedPerson = {};
    $scope.deleteCtrl.showDeletePopup = function(person){
        $scope.deleteCtrl.showDeleteModal = true;
        $scope.deleteCtrl.deletedPerson = person;
        $scope.deleteCtrl.cancel = function () {
            $scope.deleteCtrl.showDeleteModal = false;
        };
    };

    $scope.deleteCtrl.deletePerson = function(){

        $http.post('/deletePerson', $scope.deleteCtrl.deletedPerson)
            .success(function() {
                var deletedPersonIndex = $scope.persons.indexOf($scope.deleteCtrl.deletedPerson);
                $scope.persons.splice(deletedPersonIndex, 1);
                $scope.isUpdatedSuccess = true;
                $scope.showAlert = true;
            })
            .error(function(data){
                $scope.isUpdatedSuccess = false;
                $scope.showAlert = true;
            });

        $scope.deleteCtrl.showDeleteModal = false;
    }
}]);