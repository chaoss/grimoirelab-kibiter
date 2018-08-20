import { DashboardViewMode } from '../dashboard_view_mode';
import { FilterUtils } from './filter_utils';

export function getAppStateDefaults(savedDashboard, hideWriteControls, scope) {
  function checkEditView(dashboard, scope) {
    if(scope && scope.$root.showDefaultMenu) {
      return DashboardViewMode.EDIT;
    }
    return DashboardViewMode.VIEW;
  }



  return {
    fullScreenMode: false,
    title: savedDashboard.title,
    description: savedDashboard.description,
    timeRestore: savedDashboard.timeRestore,
    panels: savedDashboard.panelsJSON ? JSON.parse(savedDashboard.panelsJSON) : [],
    options: savedDashboard.optionsJSON ? JSON.parse(savedDashboard.optionsJSON) : {},
    uiState: savedDashboard.uiStateJSON ? JSON.parse(savedDashboard.uiStateJSON) : {},
    query: FilterUtils.getQueryFilterForDashboard(savedDashboard),
    filters: FilterUtils.getFilterBarsForDashboard(savedDashboard),
    viewMode: savedDashboard.id || hideWriteControls ? checkEditView(savedDashboard, scope) : DashboardViewMode.EDIT,
  };
}
