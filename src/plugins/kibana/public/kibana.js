require('plugins/kibana/discover/index');
require('plugins/kibana/visualize/index');
require('plugins/kibana/dashboard/index');
require('plugins/kibana/settings/index');
require('plugins/kibana/doc/index');
require('ui/timepicker');

const moment = require('moment-timezone');

const chrome = require('ui/chrome');
const routes = require('ui/routes');
const modules = require('ui/modules');
const Scanner = require('ui/utils/scanner');
const _ = require('lodash');

var kibanaLogoUrl = require('ui/images/bitergia-analytics-logo.png');

function setTabs(metadashboards) {
  var tabs = [];
  _.each(metadashboards, function (title, dash) {
    tabs.push({id:'dashboard/' + title, title: dash});
  });
  chrome.setTabs(tabs);
}

routes.enable();

routes
.otherwise({
  redirectTo: `/${chrome.getInjected('kbnDefaultAppId', 'discover')}`
});

chrome
.setBrand({
  'logo': 'url(' + kibanaLogoUrl + ') left no-repeat',
  'smallLogo': 'url(' + kibanaLogoUrl + ') left no-repeat',
  'title': ''
})
.setNavBackground('#333333')
.setTabDefaults({
  resetWhenActive: true,
  lastUrlStore: window.sessionStore,
  activeIndicatorColor: '#ED9C06;'
})
.setRootController('kibana', function ($scope, $rootScope, courier, config, es, kbnIndex) {
  function setDefaultTimezone() {
    moment.tz.setDefault(config.get('dateFormat:tz'));
  }

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
    setTabs(results.hits[0]._source);
  });

  // wait for the application to finish loading
  $scope.$on('application.load', function () {
    courier.start();
  });

  $scope.$on('init:config', setDefaultTimezone);
  $scope.$on('change:config.dateFormat:tz', setDefaultTimezone);
});
