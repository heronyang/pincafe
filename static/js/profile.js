var lat = 0;
var lng = 0;

function initMap() {

  var mapDiv = document.getElementById('map');
  var map = new google.maps.Map(mapDiv, {

      center: {lat: lat, lng: lng},
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

  var fakeMarker ={lat: lat, lng: lng};
  var marker = new google.maps.Marker({
      position: fakeMarker,
      map: map
  });

}

function setupLightBox() {

  $(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
    event.preventDefault();
    $(this).ekkoLightbox();
  });

  (function e(){var e=document.createElement("script");e.type="text/javascript",e.async=true,e.src="//staticw2.yotpo.com/Bgp8YMt9eyVHT7XyHTOAO5zRHBxsvcwJuF44owJE/widget.js";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t);})();

}

function setupParse() {

  Parse.initialize('XJFp6TdDwyF3T');
  Parse.serverURL = 'https://pincafe-parse.herokuapp.com/';

}

function pincafeProfileInit(cafeId) {

  var Cafe = Parse.Object.extend('Cafe');
  var query = new Parse.Query(Cafe);
  query.equalTo('cafeId', cafeId);
  query.find({
      success: function(cafes) {
        console.log('success', cafes.length);
        for(var i = 0; i < cafes.length; i ++) {
          var cafe = cafes[i];
          insertCafeDataToLayout(cafe);
        }
      },
      error: function(object, error) {
        console.log('fail');
      }
  });

}

function insertCafeDataToLayout(cafe) {

  insertName(cafe);
  insertAlternativeName(cafe);
  insertPhone(cafe);
  insertAddress(cafe);
  insertOpeningHours(cafe);
  insertRating(cafe);
  insertFoodType(cafe);
  insertTags(cafe);
  insertDescription(cafe);
  insertUtility(cafe);

  setupMap(cafe);

}

function insertName(cafe) {

  var name = $('#pincafe-name');
  var nameText = cafe.get('name');
  name.text(nameText);

}

function insertAlternativeName(cafe) {

  var alternativeName = $('#pincafe-alternative-name');

  var alternativeNameText = cafe.get('alternativeName');
  if(alternativeNameText !== '') {
    alternativeName.text('(' + alternativeNameText + ')');
    alternativeName.show();
  }

}

function insertPhone(cafe) {

  var phone=  $('#pincafe-phone');

  var phoneText = cafe.get('phone');
  phone.text(phoneText);

}

function insertAddress(cafe) {

  var address = $('#pincafe-address');

  var addressText = cafe.get('address');
  address.text(addressText);

}

function insertOpeningHours(cafe) {

  var openingHoursTypesRelation = cafe.relation('openingHoursTypes');

  var openingHours = $('#pincafe-opening-hours');
  var openingHoursTypesQuery = openingHoursTypesRelation.query();

  openingHoursTypesQuery.find({
      success: function(results) {
        var openingHoursText = '';
        for(var i = 0; i < results.length; i ++) {
          var result = results[i];
          if(i > 0) {
            openingHoursText += '、';
          }
          openingHoursText += result.get('description');
        }
        openingHours.text(openingHoursText);
      },
      error: function(error) {
        console.log('Error: ' + error.code + ' ' + error.message);
      }
  });

}

function insertRating(cafe) {

  var ratingAverageValue = cafe.get('ratingAverage');
  var ratingCountValue = cafe.get('ratingCount');

  var ratingCount = $('#pincafe-rating-count');
  ratingCount.text(ratingCountValue);
  console.log(ratingAverageValue, ratingCountValue);

  var ratingStars = $('#pincafe-rating-stars');
  var ratingStarsHtml = '';
  var r = Math.round(ratingAverageValue);

  var i;
  for(i=1 ; i <= r ; i++) {
    ratingStarsHtml += '<i class="fa fa-star"></i>';
  }
  for(i=r ; i<5 ; i++) {
    ratingStarsHtml += '<i class="fa fa-star-o"></i>';
  }
  ratingStars.html(ratingStarsHtml);

}

function insertFoodType(cafe) {

  var foodTypesRelation = cafe.relation('foodTypes');
  var foodTypesQuery = foodTypesRelation.query();

  foodTypesQuery.find({
      success: function(results) {
        var foodTypes = $('#pincafe-foodtypes');
        var foodTypesHtml = '';
        for(var i = 0; i < results.length; i ++) {
          var f = results[i];
          foodTypesHtml += '<span class="foodtype-tag">' + f.get('name') + '</span>';
        }
        foodTypes.html(foodTypesHtml);
      },
      error: function(error) {
        console.log('Error: ' + error.code + ' ' + error.message);
      }
  });

}

function insertTags(cafe) {

  var tagsRelation = cafe.relation('tags');
  var tagsQuery = tagsRelation.query();

  tagsQuery.find({
      success: function(results) {
        var tags = $('#pincafe-tags');
        var tagsHtml = '';
        for(var i = 0; i < results.length; i ++) {
          var t = results[i];
          tagsHtml += '<li><a href="#">#' + t.get('name') + '</a></li>';
        }
        tags.html(tagsHtml);
      },
      error: function(error) {
        console.log('Error: ' + error.code + ' ' + error.message);
      }
  });

}

function insertDescription(cafe) {

  var descriptionText = cafe.get('description');
  var description = $('#pincafe-description');
  description.text(descriptionText);

}

function insertUtility(cafe) {

  var hasFreeWifi = cafe.get('hasFreeWifi');
  var hasPowerOutlet = cafe.get('hasPowerOutlet');
  var hasTimeLimitation = cafe.get('hasTimeLimitation');
  var isQuiet = cafe.get('isQuiet');
  var isReservationAvailable = cafe.get('isReservationAvailable');

  $('#pincafe-wifi').html('<img src="/img/item_wifi' + ((hasFreeWifi) ? '' : '-x') + '.png"/>');
  $('#pincafe-power').html('<img src="/img/item_power' + ((hasPowerOutlet) ? '' : '-x') + '.png"/>');
  $('#pincafe-time').html('<img src="/img/item_time' + ((hasTimeLimitation) ? '' : '-x') + '.png"/>');
  $('#pincafe-quite').html('<img src="/img/item_quite.' + ((isQuiet) ? '' : '-x') + 'png"/>');
  $('#pincafe-booking').html('<img src="/img/item_booking' + ((isReservationAvailable) ? '' : '-x') + '.png"/>');

}

function setupMap(cafe) {
  lat = parseFloat(cafe.get('latitude'));
  lng = parseFloat(cafe.get('longitude'));
  $.getScript("https://maps.googleapis.com/maps/api/js?callback=initMap&key=AIzaSyDiw_0Dnug9zP27jioy8ezTik5aF2Kw83o");
}

setupParse();
setupLightBox();
