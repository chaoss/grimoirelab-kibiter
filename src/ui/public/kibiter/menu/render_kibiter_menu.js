
export function renderKibiterMenu($scope) {
    // Define the number of columns
    let numberColumns = 4

    $scope.showInfo = (item) => {
        if (item.type === "entry") {
            $scope.redirectToPanel(item.name, item.panel_id)
        } else if (item.type === "menu") {
            if ($scope.parentDashboard === item) {
                closeSubmenu($scope)
            } else {
                showSubmenu($scope, item)
            }
        }
    }

    $scope.showDescription = (subitem) => {
        $scope.showDescriptionDiv = true;
        $scope.descriptionTitle = subitem.title;
        $scope.descriptionContent = subitem.description;
    }

    $scope.hideDescription = () => {
        $scope.showDescriptionDiv = false;
    }

    $scope.redirectToPanel = (name, panel_id) => {
        $scope.showKibiterMenu = false;
        if (name === "Contact") {
            window.location.replace(panel_id)
        } else {
            window.location.replace(window.location.href.split("app/")[0] + "app/kibana#/dashboard/" + panel_id)
        }
    }

    const showSubmenu = ($scope, item) => {
        $scope.showKibiterMenu = true;
        $scope.parentDashboard = item;
        $scope.currentPanelsons = new Array(numberColumns)
        let countItems = 0;
        item.dashboards.forEach((subitem) => {
            if (!$scope.currentPanelsons[countItems]) {
                $scope.currentPanelsons[countItems] = []
            }
            $scope.currentPanelsons[countItems].push(subitem)
            if (countItems >= numberColumns - 1) {
                countItems = 0;
            } else {
                countItems++
            }
        })
    }

    const closeSubmenu = ($scope) => {
        $scope.showKibiterMenu = false;
        $scope.parentDashboard = undefined;
    }
}
