
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
        const isSecondOpen = globalNavState.isSecondOpen();
        scope.isSecondNavOpen = isSecondOpen;
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
        if(globalNavState.isSecondOpen()) {
          globalNavState.setSecondOpen(!globalNavState.isSecondOpen());
          scope.actualPanel = undefined;
        }
      };

      scope.toggleSecondNav = (panel, event) => {
        //Open first nav-bar
        if(!globalNavState.isOpen()){
          globalNavState.setOpen(!globalNavState.isOpen())
        }
        //If clicking in the same panel, it must be open/close
        if(panel == scope.actualPanel){
          globalNavState.setSecondOpen(!globalNavState.isSecondOpen());
          if(!globalNavState.isSecondOpen()){
            //If closed, hide the space
            scope.actualPanel = undefined;
          }
          return;
        }
        //If clickng in other panel
        scope.actualPanel = panel;
        if(!globalNavState.isSecondOpen()){
          globalNavState.setSecondOpen(!globalNavState.isSecondOpen());
        }
      };

      /*
      * Function that changes the CSS of the item that was clicked
      */
      scope.selectedItem = 0;
      scope.$root.  itemClicked = ($index) => {
        scope.selectedItem = $index;
        //Close second nav if it was open
        if(globalNavState.isSecondOpen()) {
          globalNavState.setSecondOpen(!globalNavState.isSecondOpen());
          scope.actualPanel = undefined;
        }
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
        scope.$root.metadash = results.hits[0]._source;
      });

    }
  };
});
