
import './app_switcher';
import './global_nav_link';

import globalNavTemplate from './global_nav.html';
import './global_nav.less';
import { uiModules } from 'ui/modules';

const module = uiModules.get('kibana');

module.directive('globalNav', (es, kbnIndex, globalNavState, chrome) => {
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

      scope.getHref = path => {
        return chrome.addBasePath(path);
      };

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
      scope.$root.itemClicked = ($index) => {
        scope.selectedItem = $index;
        //Close second nav if it was open
        if(globalNavState.isSecondOpen()) {
          globalNavState.setSecondOpen(!globalNavState.isSecondOpen());
          scope.actualPanel = undefined;
        }
      };

      /*
      * Function that closes the second nav if it was open
      */
      scope.$root.closeSecondNav = () => {
        if(globalNavState.isSecondOpen()) {
          globalNavState.setSecondOpen(!globalNavState.isSecondOpen());
          scope.actualPanel = undefined;
      }
      };

      //Default menu of Kibana by default
      scope.$root.showDefaultMenu = true;
      //get metadashboard
      es.search({
       index: '.kibana',
       body: {
         query: {
           match: {
             _id:  "metadashboard"
           }
         }
       }
      }).then(function (resp) {
      	scope.$root.metadash = resp.hits.hits[0]._source.metadashboard;
        scope.$root.loadedMetadashboard = true;
        scope.$root.showDefaultMenu = false;
      })

      scope.$root.appTitleCustom = "GrimoireLab"
      es.search({
       index: '.kibana',
       body: {
         query: {
           match: {
             _id:  "projectname"
           }
         }
       }
      }).then(function (resp) {
      	scope.$root.appTitleCustom = resp.hits.hits[0]._source.projectname.name;
      })
    }
  };
});
