app.service('GoogleMapService', ['flickrService', function(flickrService) {

  GoogleMap.prototype.setMarker = function() {
    var myLatLng;
    var title;
    if (arguments[0]) {
      myLatLng = {
        lat: arguments[0].position.lat(),
        lng: arguments[0].position.lng()
      };
      title = arguments[0].title;
    } else {
      myLatLng = {
        lat: this.latitude,
        lng: this.longitude
      };
      title = 'You are here';
    }

    var marker = new google.maps.Marker({
      position: myLatLng,
      animation: google.maps.Animation.DROP,
      title: title
    });

    marker.setMap(this.map);
    this.markers.push(marker);
  };

  GoogleMap.prototype.clearMarkers = function() {
    this.markers.forEach(function(marker) {
      marker.setMap(null);
    });
    this.markers = [];
  };


  function GoogleMap(data) {
    this.latitude = data.latitude || 0;
    this.longitude = data.longitude || 0;
    this.myTypeId = google.maps.MapTypeId.TERRAIN;
    this.zoom = data.zoom || 10;
    this.element = data.element;
    this.fullscreenControl = data.fullscreenControl || true;
    this.searchBox = data.search;
    this.markers = [];

    var mapOptions = {
      MapTypeId: this.myTypeId,
      center: new google.maps.LatLng(this.latitude, this.longitude),
      zoom: this.zoom,
      fullscreenControl: true
    };

    this.map = new google.maps.Map(this.element, mapOptions);
  }

  GoogleMap.prototype.searchBox = function() {


    var searchBox = new google.maps.places.SearchBox(this.searchBox);
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();
      if (places.length === 0) {
        return;
      }
      this.clearMarkers();
      this.searchBox.value = '';
      this.bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {

        this.bounds.extend(place.geometry.location);
        var markerParams = {
          map: this.map,
          animation: google.maps.Animation.DROP,
          title: place.name,
          position: place.geometry.location
        };
        this.longitude = place.geometry.location.lng();
        this.latitude = place.geometry.location.lat();
        this.setMarker(markerParams);
        this.map.fitBounds(this.bounds);
        this.map.getCenter();
        var zoom = this.map.getZoom();
        this.map.setZoom(zoom > 15 ? 15 : zoom);
      }.bind(this));

    }.bind(this));
    return searchBox;
  };

  GoogleMap.prototype.getLatLon = function() {
    return {
      lon: this.longitude,
      lat: this.latitude
    };
  };

  GoogleMap.prototype.getPhotos = function(arg) {
    var location = !!arg ? { lat: arg.latitude, lon: arg.longitude } : this.getLatLon();
    return flickrService.get(this.getLatLon(location));
  };


  function init(data) {
    try {
      angular.isObject(google);
    } catch (err) {
      error = 'Problem with connection';
      return { error: error };
    }

    var obj = new GoogleMap(data);

    return {
      getPhotos: GoogleMap.prototype.getPhotos.bind(obj),
      searchBox: GoogleMap.prototype.searchBox.bind(obj),
      setMarker: GoogleMap.prototype.setMarker.bind(obj)
    };
  }


  return {
    init: init
  };
}]);
