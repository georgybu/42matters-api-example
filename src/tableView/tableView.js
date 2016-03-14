// @ngInject
function tableViewController(api) {
  this.items = function() {
    return api.getItems(this.view);
  };
  this.isBusy = function() {
    return api.getBusyIndication();
  };
}

angular.getAppModule()
    .component('tableView', angular.getComponent('tableView', { view: '='}))
    .controller('tableViewController', tableViewController);
