var appName = 'main';

// setup CORS
function appConfig($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
}

angular.module(appName, []).config(appConfig);

angular.getAppModule = function () {
  return angular.module(appName);
};

angular.getComponent = function (componentName, bindings) {
  return {
    controller: componentName + 'Controller as ' + componentName,
    templateUrl: 'src/' + componentName + '/' + componentName + '.html',
    bindings: bindings || {}
  };
};
