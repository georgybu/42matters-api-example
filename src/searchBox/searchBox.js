// @ngInject
function searchBoxController(api) {
  this.go = function(searchString) {
    api.setAppName(searchString);
  }
}

angular.getAppModule()
    .component('searchBox', angular.getComponent('searchBox'))
    .controller('searchBoxController', searchBoxController);
