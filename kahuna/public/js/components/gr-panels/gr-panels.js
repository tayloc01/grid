import angular from 'angular';
import Rx from 'rx';
import 'rx-dom';

import './gr-panels.css!';
import '../../services/panel';
import '../../util/rx';
import '../../util/eq';

export const panels = angular.module('gr.panels', ['kahuna.services.panel', 'util.rx', 'util.eq']);

panels.directive('grPanels', [function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: `<div class="gr-panels">
            <div class="gr-panels-content" ng:transclude></div>
        </div>`
    };
}]);

panels.directive('grPanel', ['$timeout', '$window', 'inject$', 'subscribe$', 'panelService',
                             function($timeout, $window, inject$, subscribe$, panelService) {

    function setFullHeight(element) {
        const offset = element.position().top;
        const height = `calc(100vh - ${offset}px)`;

        element.css({ height });
    }

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            panel: '=grPanel',
            left: '=?grLeft',
            right: '=?grRight'
        },
        template:
            `<div class="gr-panel" ng:class="{
                'gr-panel--left': left,
                'gr-panel--right': right,
                'gr-panel--hidden': hidden,
                'gr-panel--locked': locked }">
                <div class="gr-panel__content" gr:panel-height>
                    <ng:transclude></ng:transclude>
                </div>
            </div>`,
        link: function(scope, element) {
            function setElementHeight() {
                setFullHeight(element);
                scope.panelHeight = element.height();
            }
            const panel = scope.panel;
            const winScroll$ = Rx.DOM.fromEvent($window, 'scroll');
            const winResize$ = Rx.DOM.fromEvent($window, 'resize');
            // This is done to make sure we trigger on the template being rendered,
            // if we don't we get the semi-rendered template offset
            $timeout(setElementHeight, 0);

            inject$(scope, panel.hidden$, scope, 'hidden');
            inject$(scope, panel.locked$, scope, 'locked');

            // If we are window scrolling whilst visible and unlocked
            const scrollWhileVisAndUnlocked$ = winScroll$.
                withLatestFrom(
                    panel.hidden$,
                    panel.locked$,
                    (ev, hidden, locked) => ({ev, hidden, locked})).
                filter(({ev, hidden, locked}) => !(hidden || locked)).
                map(({ev}) => ev);

            // Then hide the panel
            subscribe$(scope, scrollWhileVisAndUnlocked$, () => {
                scope.$apply(() => panel.setHidden(true));
            });

            // Reset the panel heights
            subscribe$(scope, winResize$.debounce(500), setElementHeight);
        }
    };
}]);

panels.directive('grPanelHeight', ['onValChange', function(onValChange) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            scope.$watch('panelHeight', onValChange(height => {
                element.height(height);
            }));
        }
    }
}]);

panels.directive('grPanelContent', [function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: `<div class="gr-panelled-content"><ng:transclude></ng:transclude></div>`
    };
}]);
