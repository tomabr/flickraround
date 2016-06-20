var app = angular.module('myApp', ['ui.materialize', 'angular-flexslider']);
app.constant('apiKey', 'f8ce2d65669e201b2b50723818e2b16b');

app.controller('MainController', ['$scope', '$element', '$window', 'GoogleMapService', 'location', 'closeWindow',
  function($scope, $element, $window, GoogleMapService, location, closeWindow) {


    var mapOptions = {
      latitude: 50,
      longitude: 20,
      search: $element.find('#inpt')[0],
      element: $element.find('#map')[0]
    };


    function getPhotos(mymap, location) {




      $scope.preloader = true;
      $scope.photos = [];
      var param;
      if (location) {
        param = location;
      } else {
        param = undefined;
      }
      mymap.getPhotos(param).then(function(response) {
        $scope.photos = response;
        $scope.preloader = false;
        closeWindow($element.find('.collapsible'));
      }, function(error) {
        $scope.preloader = false;
        Materialize.toast(error.message, 8000);
      });
    }

    var mymap = GoogleMapService.init(mapOptions);

    if (!!mymap.error) {
      Materialize.toast(mymap.error, 8000);
    }
    var searchBox = mymap.searchBox();

    searchBox.addListener('places_changed', function() {
      getPhotos(mymap);
    });

    $window.onclick = function(event) {
      if ($element.find(event.target).closest('.collapsible').length === 0) {
        closeWindow($element.find('.collapsible'));
      }
    };

    $scope.setImage = function(photo) {
      var url = photo.url.split('.');
      console.log(url.length);
      url[url.length - 2] = url[url.length - 2].slice(0, -2);
      console.log(url);
      photo.url = url.join('.');
      $scope.image = photo;
    };

    $scope.takeLocalization = function() {
      location.getPosition().then(function(response) {
        mapOptions.latitude = response.latitude;
        mapOptions.longitude = response.longitude;
        mapOptions.zoom = 16;
        mymap = GoogleMapService.init(mapOptions);
        mymap.setMarker();
        searchBox = mymap.searchBox();
        getPhotos(mymap, location);
        searchBox.addListener('places_changed', function() {
          getPhotos(mymap);
        });
      }, function(error) {
        Materialize.toast(error.message, 8000);
      });
    };

  }
]);
