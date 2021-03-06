import angular from 'angular';
import template from './user-actions.html';

export var userActions = angular.module('kahuna.common.userActions', []);

userActions.controller('userActionCtrl',
    [
        function() {
            var ctrl = this;
            ctrl.feedbackFormLink = window._clientConfig.feedbackFormLink;
        }]);

userActions.directive('uiUserActions', [function() {
    return {
        restrict: 'E',
        controller: 'userActionCtrl',
        controllerAs: 'ctrl',
        bindToController: true,
        template: template,
        scope: {} // ensure isolated scope
    };
}]);
