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

  var Cafe = Parse.Object.extend("Cafe");
  var query = new Parse.Query(Cafe);
  query.equalTo("cafeId", cafeId);
  query.find({
      success: function(cafes) {
        console.log("success", cafes.length);
        for(var i = 0; i < cafes.length; i ++) {
          var cafe = cafes[i];
          insertCafeDataToLayout(cafe);
        }
      },
      error: function(object, error) {
        console.log("fail");
      }
  });

}

function insertCafeDataToLayout(cafe) {

  var name = $('#pincafe-name');
  var alternativeName = $('#pincafe-alternative-name');
  var phone=  $('#pincafe-phone');
  var address = $('#pincafe-address');

  var nameText = cafe.get("name");
  name.text(nameText);

  var alternativeNameText = cafe.get("alternativeName");
  if(alternativeNameText !== '') {
    alternativeName.text('(' + alternativeNameText + ')');
    alternativeName.show();
  }

  var phoneText = cafe.get("phone");
  phone.text(phoneText);

  var addressText = cafe.get("address");
  address.text(addressText);

  var openingHoursTypesRelation = cafe.relation("openingHoursTypes");
  fillOpeningHoursSummary(openingHoursTypesRelation);

}

function fillOpeningHoursSummary(openingHoursTypesRelation) {

  var openingHours = $('#pincafe-opening-hours');
  var openingHoursTypesQuery = openingHoursTypesRelation.query();

  openingHoursTypesQuery.find({
      success: function(results) {
        var openingHoursText = "";
        for(var i = 0; i < results.length; i ++) {
          var result = results[i];
          if(i > 0) {
            openingHoursText += '、';
          }
          openingHoursText += result.get("description");
        }
        openingHours.text(openingHoursText);
      },
      error : function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
  });

}


setupParse();
setupLightBox();
