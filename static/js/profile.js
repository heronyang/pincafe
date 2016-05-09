var lat = 0;
var lng = 0;

var CurrentPageCafe = null;

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

  CurrentPageCafe = cafe;

  insertImages(cafe);
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

function insertImages(cafe) {

  var Image = Parse.Object.extend('Image');
  var query = new Parse.Query(Image);

  query.equalTo('cafe', cafe);
  query.find({
      success: function(images) {
        insertImagesHandler(images);
      },
      error: function(object, error) {
        console.log('fail');
      }
  });

}

function insertImagesHandler(images) {
  var imageContainer = $('#pincafe-image-container');
  var imageContainerHtml = '';
  for(var i = 0; i < images.length; i ++) {
    var image = images[i];
    var url = image.get('url');
    if(image.get('isLarge')) {
      $('#pincafe-large-image').attr("src", image.get('url'));
    }
    imageContainerHtml += 
      '<a href="' + url + '" data-toggle="lightbox"><img class="img-responsive" src="' + url + '" /></a>';
  }
  imageContainer.html(imageContainerHtml);
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
  var ratingStarsHtml = generateStarHtml(ratingAverageValue);
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
  insertTagsAsync(cafe, '#pincafe-tags');
}

function insertDescription(cafe) {

  var descriptionText = cafe.get('description');
  var description = $('#pincafe-description');
  description.html(replaceNewLineBreakWithHtmlBr(descriptionText));

}

function replaceNewLineBreakWithHtmlBr(str) {
    return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
}

function insertUtility(cafe) {

  insertUtilityAsync(cafe,
    '#pincafe-wifi',
    '#pincafe-power',
    '#pincafe-time',
    '#pincafe-quite',
    '#pincafe-reservation'
  );

}

function setupMap(cafe) {
  lat = parseFloat(cafe.get('latitude'));
  lng = parseFloat(cafe.get('longitude'));
  $.getScript("https://maps.googleapis.com/maps/api/js?callback=initMap&key=AIzaSyDiw_0Dnug9zP27jioy8ezTik5aF2Kw83o");
}

function setupRatingHandler() {
  $(document).on('click', '.pincafe-rating', function() {
    var value = $(this).data('value');
    submitRating(value);
  });
}

function submitRating(value) {
  $('#rating-modal').modal('toggle');

  var Rating = Parse.Object.extend('Rating');
  var rating = new Rating();

  rating.set('cafe', CurrentPageCafe);
  rating.set('value', value);
  rating.set('userId', ''); // TODO: do cookie

  rating.save(null, {
      success: function(rating) {
        if(!alert('評分成功')) {
          window.location.reload();
        }
      },
      error: function(rating, error) {
        alert('評分失敗');
        console.log('Failed to create new object, with error code: ' + error.message);
      }
  });

}

setupParse();
$(document).ready(function () {
  setupLightBox();
  setupRatingHandler();
});
