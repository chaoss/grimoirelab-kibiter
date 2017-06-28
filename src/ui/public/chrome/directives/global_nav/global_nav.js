
import './app_switcher';
import './global_nav_link';

import globalNavTemplate from './global_nav.html';
import './global_nav.less';
import uiModules from 'ui/modules';

import Scanner from 'ui/utils/scanner';

const module = uiModules.get('kibana');

module.directive('globalNav', (es, kbnIndex, globalNavState) => {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      chrome: '=',
      isVisible: '=',
      logoBrand: '=',
      smallLogoBrand: '=',
      appTitle: '=',
    },
    template: globalNavTemplate,
    link: scope => {
      // App switcher functionality.
      function updateGlobalNav() {
        const isOpen = globalNavState.isOpen();
        scope.isGlobalNavOpen = isOpen;
        scope.globalNavToggleButton = {
          classes: isOpen ? 'global-nav-link--close' : undefined,
          title: isOpen ? 'Collapse' : 'Expand',
          tooltipContent: isOpen ? 'Collapse side bar' : 'Expand side bar',
        };

        // Notify visualizations, e.g. the dashboard, that they should re-render.
        scope.$root.$broadcast('globalNav:update');
      }

      updateGlobalNav();

      scope.$root.$on('globalNavState:change', () => {
        updateGlobalNav();
      });

      scope.toggleGlobalNav = event => {
        event.preventDefault();
        globalNavState.setOpen(!globalNavState.isOpen());
      };

      function getMetaDashboards() {
        var queryString = '';
        var pageSize = 1000;

        var scanner = new Scanner(es, {
          index: kbnIndex,
          type: 'metadashboard'
        });

        return scanner.scanAndMap(queryString, {
          pageSize,
          docCount: Infinity
        }, function (hit) {return hit;});
      }

      getMetaDashboards().then(function (results) {
        scope.metadash = results.hits[0]._source;
      });

    }
  };
});
