
var app = angular.module('myApp', ['ng-sortable']);

app.config( [
    '$compileProvider',
    function( $compileProvider )
    {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }
]);

app.service('store', function () {
  return function (name, value) {
    try {
      if (value) {
        localStorage.setItem(name, JSON.stringify(value));
      } else {
        return JSON.parse(localStorage.getItem(name));
      }
    } catch (err) {}
  };
});


app.factory('sortable', ['store', function (store) {
  return function (name, idAttr, models) {
    var i,
        idx,
        tmp,
        order = store(name);

    if (order) {
      // Restore
      i = models.length;

      while (i--) {
        idx = order.indexOf(models[i][idAttr]);

        if (idx > -1 && idx !== i) {
          tmp = models[i];
          models[i] = models[idx];
          models[idx] = tmp;
        }
      }
    }

    return {
      options: {
        animation: 150,
        handle: '.my-handle',
        onSort: function (evt) {
          // Save
          store(name, evt.models.map(function (model) {
            return model[idAttr];
          }));
        }
      },

      models: models,
    };
  };
}]);


ext_path = chrome.extension.getURL;


app.controller('demo', [
  '$scope',
  'sortable',
  function ($scope, sortableFactory) {
    var sortable = sortableFactory("any name", "id", [
      {
        id: 1,
        name: 'jqueryrain',
        url: 'jqueryrain.com',
        icon: ext_path('/images/jqueryrain.png'),
        desc: 'Best jQuery Plugins & Tutorials'
      },
      {
        id: 2,
        name: 'codepen',
        url: 'codepen.io',
        icon: ext_path('/images/codepen.png'),
        desc: 'Code Playground'
      },
      {
        id: 3,
        name: 'codevisually',
        url: 'codevisually.com',
        icon: ext_path('/images/codevisually.png'),
        desc: 'Web Developer Tools & Resources'
      },
      {
        id: 4,
        name: 'codegeekz',
        url: 'codegeekz.com',
        icon: ext_path('/images/codegeekz.png'),
        desc: 'Web Developer Tools & Resources'
      },
      {
        id: 5,
        name: 'webdesignerdepot',
        url: 'webdesignerdepot.com',
        icon: ext_path('/images/webdesignerdepot.png'),
        desc: 'Web Developer Tools & Resources'
      }
     ]);

    $scope.models = sortable.models;
    $scope.sortableOptions = sortable.options;
}]);


(function () {

    app.controller('CheckCtrl', function ($scope) {
        $scope.value = false;
        $scope.isChecked = 'dark';
        return $scope.checkIt = function () {
            $scope.isChecked = 'dark';
            if ($scope.value) {
                return $scope.isChecked = 'light';
            }
        };
    });
}.call(this));
