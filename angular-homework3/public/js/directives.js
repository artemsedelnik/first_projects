/**
 * Created by ArtemSedelnik on 15.09.15.
 */
var Directives = angular.module('Directives', []);

Directives.directive ('customModal', ['$parse', function($parse){
   return {
       restrict: 'E',
       templateUrl: 'templates/popUp.html',
       scope: true,
       link: function($scope, element, attrs){

           var submitFunction = $parse(attrs.onsubmit);
           var cancelFunction = $parse(attrs.oncancel);
           $scope.onsubmit =  function(){
               submitFunction($scope);
           };
           $scope.oncancel =  function(){
               cancelFunction($scope);
           };

           $scope.okText = attrs.okText;
           $scope.cancelText = attrs.cancelText;
           $scope.$watch('showModal', function(value) {
               if(value == true)
                   $('.modal').modal('show');
               else
                   $('.modal').modal('hide');

               attrs.$set('show', $scope.showModal);
           });
       }
   }
}]);