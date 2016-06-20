app.service('closeWindow', [function() {

  function close(elm) {

    elm.find(".collapsible-header").removeClass(function() {
      return "active";
    });

    elm.collapsible({ accordion: true });
    elm.collapsible({ accordion: false });
  }

  return close;
}]);
