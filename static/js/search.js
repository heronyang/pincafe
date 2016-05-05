$(document).ready(function() {
  setSpecificTimeModalToNowInDefault();
});

function setSpecificTimeModalToNowInDefault() {

  var now = new Date();
  var weekday = now.getDay();
  var startHours = now.getHours();
  var endHours = (startHours < 23)? (startHours + 1) : (startHours - 23);

  $('#specific-time-weekday').val(weekday);
  $('#specific-time-start-hour').val(startHours);
  $('#specific-time-end-hour').val(endHours);

}

$('.option-box').click(function () {
  $(this).toggleClass('enabled');
});

$('.option-box.option-box-time').click(function () {
  $('.option-box.option-box-time').removeClass('enabled');
  $(this).addClass('enabled');
});

$('#specific-time-confirm').click(function() {
  var weekday = $('#specific-time-weekday option:selected').text();
  var startTime = $('#specific-time-start-hour option:selected').text();
  var endTime = $('#specific-time-end-hour option:selected').text();
  $('#specific-time-text').text(weekday + ' ' + startTime + ' ~ ' + endTime);
});

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

  var fakeMarker1 ={lat: 25.0226503, lng: 121.5310498};
  var fakeMarker2 ={lat: 25.0246603, lng: 121.5310498};
  var fakeMarker3 ={lat: 25.0216703, lng: 121.5300498};
  var fakeMarker4 ={lat: 25.0246803, lng: 121.5300498};
  var fakeMarker5 ={lat: 25.0236903, lng: 121.5310498};

  var marker1 = new google.maps.Marker({
      position: fakeMarker1,
      map: map
  });
  var marker2 = new google.maps.Marker({
      position: fakeMarker2,
      map: map
  });
  var marker3 = new google.maps.Marker({
      position: fakeMarker3,
      map: map
  });
  var marker4 = new google.maps.Marker({
      position: fakeMarker4,
      map: map
  });
  var marker5 = new google.maps.Marker({
      position: fakeMarker5,
      map: map
  });

}
