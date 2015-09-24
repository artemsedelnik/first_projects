/**
 * Created by ArtemSedelnik on 15.09.15.
 */
var Directives = angular.module('Directives', []);

Directives.directive ('customModal', ['$parse', function($parse){
    return {
        restrict: 'E',
        templateUrl: 'templates/popUp.html',
        controller: 'EditPersonCtrl',
        link: function($scope, element, attrs){

            var submitFunction = $parse(attrs.updatefunction);
            var cancelFunction = $parse(attrs.oncancel);

            $scope.editCtrl.updatefunction =  function(){
                submitFunction($scope);
            };

            $scope.editCtrl.oncancel =  function(){
                cancelFunction($scope);
            };

            $scope.editCtrl.okText = attrs.okText;
            $scope.editCtrl.cancelText = attrs.cancelText;
            $scope.$watch('editCtrl.showModal', function(value) {
                if(value == true)
                    $('#editModal').modal('show');
                else
                    $('#editModal').modal('hide');

                attrs.$set('show', $scope.editCtrl.showModal);
            });
        }
    }
}]);

Directives.directive ('addPersonModal', ['$parse', function($parse){
    return {
        restrict: 'E',
        templateUrl: 'templates/addModal.html',
        controller: 'AddPersonCtrl',
        link: function($scope, element, attrs){

            var submitFunction = $parse(attrs.addfunction);
            var cancelFunction = $parse(attrs.oncancel);

            $scope.addCtrl.addfunction =  function(){
                submitFunction($scope);
            };

            $scope.addCtrl.oncancel =  function(){
                cancelFunction($scope);
            };

            $scope.addCtrl.okText = attrs.okText;
            $scope.addCtrl.cancelText = attrs.cancelText;
            $scope.$watch('addCtrl.showAddModal', function(value) {
                if(value == true)
                    $('#addModal').modal('show');
                else
                    $('#addModal').modal('hide');

                attrs.$set('show', $scope.addCtrl.showAddModal);
            });
        }
    }
}]);

Directives.directive ('deletePersonModal', ['$parse', function($parse){
    return {
        restrict: 'E',
        templateUrl: 'templates/deleteModal.html',
        controller: 'DeletePersonCtrl',
        link: function($scope, element, attrs){

            var submitFunction = $parse(attrs.deletefunction);
            var cancelFunction = $parse(attrs.oncancel);

            $scope.deleteCtrl.deletefunction =  function(){
                submitFunction($scope);
            };

            $scope.deleteCtrl.oncancel =  function(){
                cancelFunction($scope);
            };

            $scope.deleteCtrl.okText = attrs.okText;
            $scope.deleteCtrl.cancelText = attrs.cancelText;
            $scope.$watch('deleteCtrl.showDeleteModal', function(value) {
                if(value == true)
                    $('#deleteModal').modal('show');
                else
                    $('#deleteModal').modal('hide');

                attrs.$set('show', $scope.deleteCtrl.showDeleteModal);
            });
        }
    }
}]);

Directives.directive ('alert', ['$parse', function($parse){
    return {
        restrict: 'E',
        templateUrl: 'templates/alert.html',
        link: function($scope, element, attrs){

            $scope.$watch('showAlert', function(value) {
                if(value == true)
                    $('.alert').show();
                else
                    $('.alert').hide();
                console.log($scope.showAlert);
                attrs.$set('show', $scope.showAlert);
            });
        }
    }
}]);