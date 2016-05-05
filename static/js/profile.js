function initMap() {
  var mapDiv = document.getElementById('map');
  var map = new google.maps.Map(mapDiv, {

      center: {lat: 25.0226503, lng: 121.5310498},
      zoom: 17,

      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      }

  });

  var fakeMarker ={lat: 25.0226503, lng: 121.5310498};
  var marker = new google.maps.Marker({
      position: fakeMarker,
      map: map
  });

}

function setupParse() {

  Parse.initialize('XJFp6TdDwyF3T');
  Parse.serverURL = 'https://pincafe-parse.herokuapp.com/';
  var Cafe = Parse.Object.extend("Cafe");
  var query = new Parse.Query(Cafe);
  // query.equalTo("name", "picnic");
  query.find({
      success: function(cafes) {
        console.log("success", cafes.length);
        for(var i = 0; i < cafes.length; i ++) {
          var cafe = cafes[i];
          var toDisplayContent = [cafe.get("name"), cafe.get("description"), cafe.get("address")];
          console.log(toDisplayContent);
        }
      },
      error: function(object, error) {
        console.log("fail");
      }
  });

}

function setupLightBox() {

  $(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
    event.preventDefault();
    $(this).ekkoLightbox();
  });

  (function e(){var e=document.createElement("script");e.type="text/javascript",e.async=true,e.src="//staticw2.yotpo.com/Bgp8YMt9eyVHT7XyHTOAO5zRHBxsvcwJuF44owJE/widget.js";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t);})();

}

setupLightBox();
setupParse();
