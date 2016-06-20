app.factory('location', ['$q', function apiTokenFactory($q) {

  var response;

  var deferred = $q.defer();

  function success(data) {
  	var position = {latitude: data.coords.latitude,
  					longitude: data.coords.longitude};
    deferred.resolve(position);
  }

  function error() {
    response = { message: 'Something is wrong. Plese refresh!' };
    deferred.reject(response);
  }

  if (!navigator.geolocation) {
    response = { message: 'Your Browser is not support geolocation' };
    deferred.reject(response);
  }

  navigator.geolocation.getCurrentPosition(success, error);

  getPosition = function() {
    return deferred.promise;
  };

  return {
    getPosition: getPosition
  };


}]);
