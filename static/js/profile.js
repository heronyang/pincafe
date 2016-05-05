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
$(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
  event.preventDefault();
  $(this).ekkoLightbox();
});
(function e(){var e=document.createElement("script");e.type="text/javascript",e.async=true,e.src="//staticw2.yotpo.com/Bgp8YMt9eyVHT7XyHTOAO5zRHBxsvcwJuF44owJE/widget.js";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t);})();

var switchTo5x=true;
