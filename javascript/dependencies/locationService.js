app.service('locationService', [

  '$http', '$q', 'location',

  function($http, $q, location) {
    var url = 'http://localhost:3000/test';
    var service = {
      getPosition: function() {
        return location.getPosition().then(function(data){
          return $http.post(url, angular.toJson(data));
        });
      }
    };

    return service;
  }
]);
