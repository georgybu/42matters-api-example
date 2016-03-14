// @ngInject
function api($http, $q, apiConfig) {

  var isBusy = false;
  var app = null;
  var top = {};

  function getBusyIndication() {
    return !!isBusy;
  }

  function getRange(num) {
    return Array.apply(null, {length: num}).map(Number.call, Number);
  }

  function setAppName(appName) {
    app = appName;
    searchByName(app);
  }

  function searchByName(name) {
    var android = apiConfig.url + 'apps/search.json?q=' + name + '&access_token=' + apiConfig.token;
    var ios = apiConfig.url + 'ios/apps/search.json?q=' + name + '&access_token=' + apiConfig.token;

    isBusy = true;
    return $q.all([$http.get(ios),$http.get(android)]).then(function(results) {
      var result = {
        ios: results[0].data.results[0],
        android: results[1].data.results[0]
      };
      return $q.all([
        getTopInCategory([result.ios.primaryGenreId], 6, 'ios'),
        getTopInCategory([result.android.cat_int], 6, 'android')
      ]).then(function(responses) {
        isBusy = false;
        top = {
          ios: {
            current: result.ios,
            list: responses[0].data.results
          },
          android: {
            current: result.android,
            list: responses[1].data.results
          }
        };
        ['ios', 'android'].map(function(platform) {
          top[platform].normilized = normalizeTop(platform);
        });
        console.log(top);

        return top;
      });

    });
  }

  function getTopInCategory(categories, limit, platform) {
    var url = null;
    var data = null;

    if (platform === 'android') {
      url = apiConfig.url + 'apps/query.json?access_token=' + apiConfig.token;
      data = {
        "query": {
          "name": "Most Popular Apps",
          "platform": "android",
          "query_params": {
            "sort": "number_ratings",
            "cat_int": categories,
            "from": 0,
            "num": limit,
            "sort_order": "desc"
          }
        }
      };
    }


    if (platform === 'ios') {
      url = apiConfig.url + 'ios/apps/query.json?access_token=' + apiConfig.token;
      data = {
        "query": {
          "name": "Most Popular Apps",
          "platform": "ios",
          "query_params": {
            "from": 0,
            "num": limit,
            "sort": "userRatingCount",
            "primaryGenreId": categories,
            "sort_order": "desc"
          }
        }
      };
    }
    return $http.post(url, data);
  }

  function normalizeObject(obj, platform) {
    if (obj) {
      if (platform === 'ios') {
        return {
          name: obj.trackCensoredName,
          developer: obj.artistName,
          rating: obj.averageUserRating,
          price: obj.formattedPrice,
          icon: obj.artworkUrl60
        }
      }

      if (platform === 'android') {
        return {
          name: obj.title,
          developer: obj.developer,
          rating: obj.rating,
          price: obj.price,
          icon: obj.icon
        }
      }
    }

    return {};
  }

  function isEqual(o1, o2, platform) {
    if (platform === 'ios') {
      return o1.trackId === o2.trackId;
    }

    if (platform === 'android') {
      return o1.package_name === o2.package_name;
    }

    return false;
  }

  function normalizeTop(platform) {
    var items = [];
    var origin = top[platform] || {};
    if (origin) {
      if (origin.current) {
        items.push(normalizeObject(origin.current, platform));
        origin.list.map(function(item) {
          if (!isEqual(item, origin.current, platform)) {
            items.push(normalizeObject(item, platform));
          }
        });
      }
    }
    return items.slice(0, 5);
  }

  function getItems(platform) {
    return (top[platform] && top[platform].normilized) || [];
  }

  return {
    setAppName: setAppName,
    getBusyIndication: getBusyIndication,
    getItems: getItems
  }

}

angular.getAppModule().factory('api', api);